import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { ChainLink } from '@/components/ChainLink';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useUserStore from '@/stores/useUser.store';

export function SearcherBar({ className }: { className?: string }) {
  const { isConnected, address: userAddress } = useUserStore();

  return (
    <div className={cn('m-auto w-full', className)}>
      <div className="relative w-full">
        <Input
          className={cn(
            'bg-muted border-secondary w-full rounded-2xl py-5.5 pl-12 sm:py-6.5',
            isConnected && 'sm:pr-32'
          )}
          placeholder="Search address or id or transaction"
        />
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
            <ChainLink to={`/address/${userAddress}`}>My activity</ChainLink>
          </Button>
        )}
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
