import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SearcherBar({ className }: { className?: string }) {
  return (
    <div className={cn('m-auto w-full max-w-2xl', className)}>
      <div className="relative w-full">
        <Input
          className="bg-input border-secondary w-full rounded-2xl py-5.5 pl-12 sm:py-6.5 sm:pr-32"
          placeholder="Search address or id or txHash"
        />
        <Search
          size="18"
          className="absolute top-1/2 left-4 -translate-y-1/2 sm:left-6"
        />
        <Button
          variant="outline"
          className="bg-input hover:bg-secondary absolute top-1/2 right-4 hidden -translate-y-1/2 sm:flex"
        >
          My activity
        </Button>
      </div>

      <Button
        variant="outline"
        className="mx-auto mt-4 flex w-auto sm:hidden"
      >
        My activity
      </Button>
    </div>
  );
}
