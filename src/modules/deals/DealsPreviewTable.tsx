import { PREVIEW_TABLE_LENGTH, PREVIEW_TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Box, LoaderCircle, Terminal } from 'lucide-react';
import { CircularLoader } from '@/components/CircularLoader';
import { DataTable } from '@/components/DataTable';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { dealsQuery } from './dealsQuery';
import { columns } from './dealsTable/columns';

export function DealsPreviewTable({ className }: { className?: string }) {
  const deals = useQuery({
    queryKey: ['deals_preview'],
    queryFn: () =>
      execute(dealsQuery, { length: PREVIEW_TABLE_LENGTH, skip: 0 }),
    refetchInterval: PREVIEW_TABLE_REFETCH_INTERVAL,
  });

  const formattedData =
    deals.data?.deals.map((deal) => ({
      ...deal,
      destination: `/deal/${deal.dealid}`,
    })) ?? [];

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans">
          <Box size="16" className="text-secondary" />
          Latest deals
          {deals.data && deals.isError && (
            <span className="text-muted-foreground text-sm font-light">
              (outdated)
            </span>
          )}
          {deals.isFetching && !deals.isPending && (
            <LoaderCircle className="animate-spin" />
          )}
        </h2>
        <Button variant="link" className="-mr-4" asChild>
          <Link to="/deals">View all</Link>
        </Button>
      </div>
      {deals.isPending ||
      (deals.isError && !deals.data) ||
      !deals.data?.deals.length ? (
        deals.isPending ? (
          <CircularLoader />
        ) : deals.isError ? (
          <Alert variant="destructive" className="mx-auto w-fit text-left">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              A error occurred during deals loading.
            </AlertDescription>
          </Alert>
        ) : (
          <p>No deals to display.</p>
        )
      ) : (
        <DataTable
          columns={columns}
          data={formattedData}
          tableLength={PREVIEW_TABLE_LENGTH}
          isLoading={deals.isLoading || deals.isRefetching}
        />
      )}
    </div>
  );
}
