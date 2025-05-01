import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SearcherBar({ className }: { className?: string }) {
  return (
    <div className={cn('relative m-auto w-full max-w-2xl', className)}>
      <Input
        className="bg-input border-secondary w-full rounded-2xl py-5.5 pr-32 pl-12 sm:py-6.5"
        placeholder="Search address or id  or txHash"
      />
      <Search
        size="18"
        className="absolute top-1/2 left-4 -translate-y-1/2 sm:left-6"
      />
      <Button
        size="sm"
        variant="outline"
        className="bg-input hover:bg-secondary absolute top-1/2 right-4 -translate-y-1/2 sm:right-6"
      >
        My activity
      </Button>
    </div>
  );
}
