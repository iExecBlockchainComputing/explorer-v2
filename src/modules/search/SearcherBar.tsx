import { execute } from '@/graphql/poco/execute';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ChainLink } from '@/components/ChainLink';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getIExec, getReadonlyIExec } from '@/externals/iexecSdkClient';
import useUserStore from '@/stores/useUser.store';
import { isValidAddress, isValidId } from '@/utils/addressOrIdCheck';
import { getChainFromId, getChainFromSlug } from '@/utils/chain.utils';
import { searchQuery } from './searchQuery';

export function SearcherBar({
  className,
  initialSearch,
}: {
  className?: string;
  initialSearch?: string;
}) {
  const { isConnected, address: userAddress } = useUserStore();
  const [inputValue, setInputValue] = useState('');
  const [shake, setShake] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [localError, setLocalError] = useState<Error | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Get ChainId from URL to be faster when using URL search
  const { chainSlug } = useParams({ from: '/$chainSlug' });
  const chainId = getChainFromSlug(chainSlug)?.id;

  const navigate = useNavigate();

  const navigateToEntity = (
    data: Record<string, unknown>,
    slug: string,
    value: string
  ) => {
    const route = Object.entries({
      deal: 'deal',
      task: 'task',
      dataset: 'dataset',
      app: 'app',
      workerpool: 'workerpool',
      account: 'address',
      transaction: 'tx',
    }).find(([entityKey]) => data[entityKey]);

    if (route) {
      const [, routePath] = route;
      navigate({ to: `/${slug}/${routePath}/${value}` });
    } else {
      throw new Error('An error occurred please try again');
    }
  };

  const { mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationKey: ['search', inputValue],
    mutationFn: async (value: string) => {
      const isValid =
        isValidAddress(value) || isValidId(value) || value.endsWith('.eth'); // ENS

      if (!isValid) {
        throw new Error('Invalid value');
      }

      let resolvedValue = value;

      if (value.endsWith('.eth')) {
        const iexec = isConnected
          ? await getIExec()
          : getReadonlyIExec(chainId!);
        const resolved = await iexec.ens.resolveName(value);
        if (!resolved) {
          throw new Error(`Fail to resolve ENS : ${value}`);
        }
        resolvedValue = resolved.toLowerCase();
      }

      const result = await execute(searchQuery, chainId, {
        search: resolvedValue,
      });

      const isEmpty = Object.values(result).every((v) => v === null);
      if (isEmpty) {
        throw new Error('No data found');
      }
      return { result, id: resolvedValue };
    },
    onSuccess: (data) => {
      const chainSlug = getChainFromId(chainId)?.slug;
      if (!chainSlug) return;
      navigateToEntity(data.result, chainSlug, data.id);
    },

    onError: (err) => {
      console.error('Search error:', err);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      requestAnimationFrame(() => {
        setErrorCount((prev) => prev + 1);
      });
    },
  });

  useEffect(() => {
    const run = async () => {
      if (initialSearch && chainId) {
        const normalized = initialSearch.trim().toLowerCase();
        setInputValue(normalized);
        try {
          setLocalError(null); // reset
          await mutateAsync(normalized);
        } catch (err) {
          console.error('Initial search error:', err);
          setErrorCount((prev) => prev + 1);
          // mutation don't return error when used in useEffect we need to use a local state
          setLocalError(
            err instanceof Error ? err : new Error('Unknown error')
          );
        }
      }
    };

    run();
  }, [initialSearch, chainId]);

  useEffect(() => {
    if (errorCount > 0) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 1_000);
      return () => clearTimeout(timer);
    }
  }, [errorCount]);

  const handleSearch = () => {
    const rawValue = inputValue.trim().toLowerCase();
    if (!rawValue) return;
    mutate(rawValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className={cn('m-auto w-full max-w-[1024px]', className)}>
      <div className="relative w-full">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          className={cn(
            'bg-muted border-secondary w-full rounded-2xl py-5.5 pl-12 text-white sm:py-6.5',
            isConnected && 'sm:pr-32',
            (isError || localError) &&
              'focus-visible:border-danger-border focus:outline-danger-border focus-visible:ring-danger-border',
            shake && 'animate-shake'
          )}
          placeholder="Search address, deal id, task id, transaction hash..."
        />
        {(localError || error) && (
          <p className="bg-danger text-danger-foreground border-danger-border absolute -bottom-8 rounded-full border px-4">
            {localError ? localError.message : error?.message}
          </p>
        )}
        <Search
          size="18"
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 sm:left-6"
        />
        {isConnected && (
          <Button
            variant="outline"
            className="bg-muted hover:bg-secondary absolute top-1/2 right-4 hidden -translate-y-1/2 sm:flex"
            asChild
          >
            <ChainLink to={`/address/${userAddress}?from=my_activity`}>
              My activity
            </ChainLink>
          </Button>
        )}
      </div>

      <div className={cn('mt-4 flex justify-center gap-4', isError && 'mt-10')}>
        <div className="flex justify-center sm:hidden">
          <Button variant="outline" onClick={handleSearch} disabled={isPending}>
            {isPending ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {isConnected && (
          <Button variant="outline" className="sm:hidden" asChild>
            <ChainLink to={`/address/${userAddress}?from=my_activity`}>
              My activity
            </ChainLink>
          </Button>
        )}
      </div>
    </div>
  );
}
