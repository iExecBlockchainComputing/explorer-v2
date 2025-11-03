import { DETAIL_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/pocoBulk/execute';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/DataTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/datasets/datasetsTable/columns';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { taskDatasetsQuery } from './taskDatasetsPocoBulkQuery';

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

  const formattedDataset =
    data?.task?.bulkSlice?.datasets.map((dataset) => ({
      ...dataset,
      destination: `/dataset/${dataset.address}`,
    })) ?? [];

  return {
    data: formattedDataset,
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
