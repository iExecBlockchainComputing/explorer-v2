import { PREVIEW_TABLE_LENGTH, PREVIEW_TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Box, LoaderCircle, Terminal } from 'lucide-react';
import { ChainLink } from '@/components/ChainLink';
import { DataTable } from '@/components/DataTable';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import useUserStore from '@/stores/useUser.store';
import { workerpoolsQuery } from './workerpoolsQuery';
import { columns } from './workerpoolsTable/columns';

export function WorkerpoolsPreviewTable({ className }: { className?: string }) {
  const { chainId } = useUserStore();
  const workerpools = useQuery({
    queryKey: [chainId, 'workerpools_preview'],
    queryFn: () =>
      execute(workerpoolsQuery, chainId, {
        length: PREVIEW_TABLE_LENGTH,
        skip: 0,
      }),
    refetchInterval: PREVIEW_TABLE_REFETCH_INTERVAL,
  });

  const formattedData =
    workerpools.data?.workerpools.map((workerpool) => ({
      ...workerpool,
      destination: `/workerpool/${workerpool.address}`,
    })) ?? [];

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans">
          <Box size="16" className="text-secondary" />
          Latest workerpools deployed
          {workerpools.data && workerpools.isError && (
            <span className="text-muted-foreground text-sm font-light">
              (outdated)
            </span>
          )}
          {workerpools.isFetching && <LoaderCircle className="animate-spin" />}
        </h2>
        <Button variant="link" className="-mr-4" asChild>
          <ChainLink to="/workerpools">View all</ChainLink>
        </Button>
      </div>
      {(workerpools.isError || workerpools.errorUpdateCount > 0) &&
      !workerpools.data ? (
        <Alert variant="destructive" className="mx-auto w-fit text-left">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            A error occurred during workerpools loading.
          </AlertDescription>
        </Alert>
      ) : (
        <DataTable
          columns={columns}
          data={formattedData}
          tableLength={PREVIEW_TABLE_LENGTH}
          isLoading={workerpools.isLoading || workerpools.isRefetching}
        />
      )}
    </div>
  );
}
