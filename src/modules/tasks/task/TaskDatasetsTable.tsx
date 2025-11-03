import { DETAIL_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { SchemaSearchPaginatedQuery } from '@/graphql/dataprotector/graphql';
import { DatasetsQuery } from '@/graphql/poco/graphql';
import { execute } from '@/graphql/pocoBulk/execute';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/DataTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/datasets/datasetsTable/columns';
import { useDatasetsSchemas } from '@/modules/datasets/hooks/useDatasetsSchemas';
import { SchemaFilter } from '@/modules/datasets/schemaFilters';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { taskDatasetsQuery } from './taskDatasetsPocoBulkQuery';

function formatDataset({
  dataset,
  schema,
  isSchemasLoading,
}: {
  dataset:
    | DatasetsQuery['datasets'][number]
    | SchemaSearchPaginatedQuery['protectedDatas'][number];
  schema?: SchemaFilter[];
  isSchemasLoading: boolean;
}) {
  return {
    address: dataset.address ?? '',
    name: dataset.name ?? '',
    schema: schema ?? [],
    isSchemasLoading: isSchemasLoading,
    owner: { address: dataset.owner?.address ?? '' },
    timestamp: dataset.timestamp,
    transfers:
      dataset.transfers ??
      ('transactionHash' in dataset && dataset.transactionHash
        ? [
            {
              transaction: {
                txHash: dataset.transactionHash,
              },
            },
          ]
        : []),
    destination: `/dataset/${dataset.address}`,
  };
}

function useTaskDatasetsData({ taskId }: { taskId: string }) {
  const { chainId } = useUserStore();

  const queryKey = [chainId, 'task', 'datasets', taskId];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(taskDatasetsQuery, chainId, {
          length: DETAIL_TABLE_LENGTH,
          taskId,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  const datasets = data?.task?.bulkSlice?.datasets || [];
  const datasetAddresses = datasets.map((dataset) => dataset.address);
  const { schemasMap, isLoading: isSchemasLoading } = useDatasetsSchemas(
    datasetAddresses,
    chainId!
  );
  const formattedDatasets = datasets.map((dataset) =>
    formatDataset({
      dataset,
      schema: schemasMap.get(dataset.address) || [],
      isSchemasLoading,
    })
  );

  return {
    data: formattedDatasets,
    isLoading,
    isRefetching,
    isError,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

export function TaskDatasetsTable({ taskId }: { taskId: string }) {
  const { data: datasets, hasPastError } = useTaskDatasetsData({ taskId });

  return hasPastError && !datasets.length ? (
    <ErrorAlert message="An error occurred during task datasets loading." />
  ) : (
    <DataTable columns={columns} data={datasets} />
  );
}
