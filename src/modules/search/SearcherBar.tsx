import { execute } from '@/graphql/execute';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { ChainLink } from '@/components/ChainLink';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useUserStore from '@/stores/useUser.store';
import { getChainFromId } from '@/utils/chain.utils';
import { fetchEnsAddress } from '@/utils/fetchEnsAddress';
import { searchQuery } from './searchQuery';

export function SearcherBar({ className }: { className?: string }) {
  const { isConnected, address: userAddress, chainId } = useUserStore();
  const [inputValue, setInputValue] = useState('');
  const [ensResolvedAddress, setEnsResolvedAddress] = useState('');

  const navigate = useNavigate();

  const navigateToEntity = (
    data: Record<string, any>,
    slug: string,
    value: string
  ) => {
    const routes = [
      'deal',
      'task',
      'dataset',
      'app',
      'workerpool',
      'account',
      'transaction',
    ];
    for (const key of routes) {
      if (data[key]) {
        navigate({
          to: `/${slug}/${key === 'account' ? 'address' : key}/${value}`,
        });
        return;
      }
    }
    navigate({ to: '/search', search: { q: value } });
    // Show error message ender search bar instead
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      execute(searchQuery, chainId, {
        search: inputValue.trim().toLowerCase(),
      }),
    onSuccess: (data) => {
      const value = inputValue.trim();
      if (!value) return;
      const chainSlug = getChainFromId(chainId)?.slug;
      if (!chainSlug) return;
      navigateToEntity(data, chainSlug, value);
    },
    onError: (err) => {
      console.error('Search error:', err);
      navigate({ to: '/search', search: { q: inputValue.trim() } });
      // Show error message ender search bar instead
    },
  });

  const handleSearch = async () => {
    const rawValue = inputValue.trim().toLowerCase();
    if (!rawValue) return;

    const isEnsName = rawValue.endsWith('.eth');

    if (isEnsName) {
      try {
        const { data: address } = await fetchEnsAddress({
          name: rawValue,
          chainId,
        });
        if (address) {
          setEnsResolvedAddress(address);
          navigate({
            to: `/${getChainFromId(chainId)?.slug}/address/${address}`,
          });
        } else {
          // ENS non résolu : fallback vers page de recherche
          navigate({ to: `/search`, search: { q: rawValue } });
        }
      } catch (err) {
        console.error('ENS resolution failed:', err);
        navigate({ to: `/search`, search: { q: rawValue } });
      }
    } else {
      mutate();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className={cn('m-auto w-full', className)}>
      <div className="relative w-full">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          className={cn(
            'bg-input border-secondary w-full rounded-2xl py-5.5 pl-12 sm:py-6.5',
            isConnected && 'sm:pr-32'
          )}
          placeholder="Search address, deal id, task id, transaction hash..."
        />
        <Search
          size="18"
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 sm:left-6"
        />
        {isConnected && (
          <Button
            variant="outline"
            className="bg-input hover:bg-secondary absolute top-1/2 right-4 hidden -translate-y-1/2 sm:flex"
            asChild
          >
            <ChainLink to={`/address/${userAddress}`}>My activity</ChainLink>
          </Button>
        )}
      </div>

      <div className="mt-3 flex justify-center sm:hidden">
        <Button variant="outline" onClick={handleSearch} disabled={isPending}>
          {isPending ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {isConnected && (
        <Button
          variant="outline"
          className="mx-auto mt-4 flex w-fit sm:hidden"
          asChild
        >
          <ChainLink to={`/address/${userAddress}`}>My activity</ChainLink>
        </Button>
      )}
    </div>
  );
}
