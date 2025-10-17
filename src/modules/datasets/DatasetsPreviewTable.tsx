import { PREVIEW_TABLE_LENGTH, PREVIEW_TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { ChainLink } from '@/components/ChainLink';
import { DataTable } from '@/components/DataTable';
import DatasetIcon from '@/components/icons/DatasetIcon';
import { Button } from '@/components/ui/button';
import { useSchemaSearch } from '@/hooks/useSchemaSearch';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { ErrorAlert } from '../ErrorAlert';
import { datasetsQuery } from './datasetsQuery';
import { createColumns } from './datasetsTable/columns';
import { useDatasetsSchemas } from './hooks/useDatasetsSchemas';

export function DatasetsPreviewTable({ className }: { className?: string }) {
  const { chainId } = useUserStore();
  const { navigateToDatasets } = useSchemaSearch();

  const queryKey = [chainId, 'datasets_preview'];
  const datasets = useQuery({
    queryKey,
    queryFn: () =>
      execute(datasetsQuery, chainId, {
        length: PREVIEW_TABLE_LENGTH,
        skip: 0,
      }),
    refetchInterval: PREVIEW_TABLE_REFETCH_INTERVAL,
    enabled: !!chainId,
    placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
  });

  const datasetsArray = datasets.data?.datasets ?? [];

  const datasetAddresses = datasetsArray.map((dataset) => dataset.address);
  const { schemasMap, isLoading: isSchemasLoading } = useDatasetsSchemas(
    datasetAddresses,
    chainId!
  );

  const columns = createColumns(navigateToDatasets);

  const formattedData =
    datasets.data?.datasets.map((dataset) => ({
      ...dataset,
      destination: `/dataset/${dataset.address}`,
      schema: schemasMap.get(dataset.address) || [],
      isSchemasLoading,
    })) ?? [];

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans">
          <DatasetIcon size={20} className="text-foreground" />
          Latest datasets deployed
          {datasets.data && datasets.isError && (
            <span className="text-muted-foreground text-sm font-light">
              (outdated)
            </span>
          )}
          {datasets.isFetching && <LoaderCircle className="animate-spin" />}
        </h2>
        <Button variant="link" className="-mr-4" asChild>
          <ChainLink to="/datasets">
            <span>
              View all{' '}
              <span className="content hidden sm:inline">datasets</span>
            </span>
          </ChainLink>
        </Button>
      </div>
      {(datasets.isError || datasets.errorUpdateCount > 0) && !datasets.data ? (
        <ErrorAlert message="An error occurred during datasets loading." />
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
