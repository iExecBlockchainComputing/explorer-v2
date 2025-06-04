import { PREVIEW_TABLE_LENGTH, PREVIEW_TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Box, LoaderCircle } from 'lucide-react';
import { ChainLink } from '@/components/ChainLink';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import useUserStore from '@/stores/useUser.store';
import { ErrorAlert } from '../ErrorAlert';
import { datasetsQuery } from './datasetsQuery';
import { columns } from './datasetsTable/columns';

export function DatasetsPreviewTable({ className }: { className?: string }) {
  const { chainId } = useUserStore();
  const datasets = useQuery({
    queryKey: [chainId, 'datasets_preview'],
    queryFn: () =>
      execute(datasetsQuery, chainId, {
        length: PREVIEW_TABLE_LENGTH,
        skip: 0,
      }),
    refetchInterval: PREVIEW_TABLE_REFETCH_INTERVAL,
    enabled: !!chainId,
  });

  const formattedData =
    datasets.data?.datasets.map((dataset) => ({
      ...dataset,
      destination: `/dataset/${dataset.address}`,
    })) ?? [];

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans">
          <Box size="16" className="text-secondary" />
          Latest datasets deployed
          {datasets.data && datasets.isError && (
            <span className="text-muted-foreground text-sm font-light">
              (outdated)
            </span>
          )}
          {datasets.isFetching && <LoaderCircle className="animate-spin" />}
        </h2>
        <Button variant="link" className="-mr-4" asChild>
          <ChainLink to="/datasets">View all</ChainLink>
        </Button>
      </div>
      {(datasets.isError || datasets.errorUpdateCount > 0) && !datasets.data ? (
        <ErrorAlert message="A error occurred during datasets loading." />
      ) : (
        <DataTable
          columns={columns}
          data={formattedData}
          tableLength={PREVIEW_TABLE_LENGTH}
          isLoading={datasets.isLoading || datasets.isRefetching}
        />
      )}
    </div>
  );
}
