import { DETAIL_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { SchemaSearchPaginatedQuery } from '@/graphql/dataprotector/graphql';
import { execute } from '@/graphql/poco/execute';
import { DatasetsQuery } from '@/graphql/poco/graphql';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { usePageParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/datasets/datasetsTable/columns';
import { useDatasetsSchemas } from '@/modules/datasets/hooks/useDatasetsSchemas';
import { SchemaFilter } from '@/modules/datasets/schemaFilters';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { getAdditionalPages } from '@/utils/format';
import { taskDatasetsQuery } from './taskDatasetsQuery';

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
      'transfers' in dataset && dataset.transfers
        ? dataset.transfers
        : 'transactionHash' in dataset && dataset.transactionHash
          ? [
              {
                transaction: {
                  txHash: dataset.transactionHash,
                },
              },
            ]
          : [],
    destination: `/dataset/${dataset.address}`,
  };
}

function useTaskDatasetsData({
  taskId,
  currentPage,
}: {
  taskId: string;
  currentPage: number;
}) {
  const { chainId } = useUserStore();
  const skip = currentPage * DETAIL_TABLE_LENGTH;
  const nextSkip = skip + DETAIL_TABLE_LENGTH;
  const nextNextSkip = skip + 2 * DETAIL_TABLE_LENGTH;

  const queryKey = [chainId, 'task', 'datasets', taskId, currentPage];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(taskDatasetsQuery, chainId, {
          length: DETAIL_TABLE_LENGTH,
          skip,
          nextSkip,
          nextNextSkip,
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
  const additionalPages = getAdditionalPages(
    Boolean(data?.task?.bulkSlice?.datasetsHasNext?.length),
    Boolean(data?.task?.bulkSlice?.datasetsHasNextNext?.length)
  );

  return {
    data: formattedDatasets,
    isLoading,
    isRefetching,
    isError,
    additionalPages,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

export function TaskDatasetsTable({
  taskId,
  setLoading,
  setOutdated,
}: {
  taskId: string;
  setLoading: (loading: boolean) => void;
  setOutdated: (outdated: boolean) => void;
}) {
  const [currentPage, setCurrentPage] = usePageParam('taskDatasetsPage');
  const {
    data: datasets,
    hasPastError,
    isLoading,
    isRefetching,
    isError,
    additionalPages,
  } = useTaskDatasetsData({ taskId, currentPage: currentPage - 1 });

  useEffect(
    () => setLoading(isLoading || isRefetching),
    [isLoading, isRefetching, setLoading]
  );
  useEffect(
    () => setOutdated(datasets.length > 0 && isError),
    [datasets.length, isError, setOutdated]
  );

  return (
    <div className="space-y-6">
      {hasPastError && !datasets.length ? (
        <ErrorAlert message="An error occurred during task datasets loading." />
      ) : (
        <DataTable columns={columns} data={datasets} />
      )}
      <PaginatedNavigation
        currentPage={currentPage}
        totalPages={currentPage + additionalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
