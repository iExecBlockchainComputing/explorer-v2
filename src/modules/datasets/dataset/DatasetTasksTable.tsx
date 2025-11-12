import { DETAIL_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { usePageParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/tasks/tasksTable/columns';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { getAdditionalPages } from '@/utils/format';
import { datasetTasksQuery } from './datasetTasksQuery';

function useDatasetTasksData({
  datasetId,
  currentPage,
}: {
  datasetId: string;
  currentPage: number;
}) {
  const { chainId } = useUserStore();
  const skip = currentPage * DETAIL_TABLE_LENGTH;
  const nextSkip = skip + DETAIL_TABLE_LENGTH;
  const nextNextSkip = skip + 2 * DETAIL_TABLE_LENGTH;

  const queryKey = [chainId, 'dataset', 'tasks', datasetId];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(datasetTasksQuery, chainId, {
          length: DETAIL_TABLE_LENGTH,
          skip,
          nextSkip,
          nextNextSkip,
          datasetId,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  const tasks = data?.dataset?.bulkUsages.map((usage) => usage.task);
  // 0 = only current, 1 = next, 2 = next+1
  const additionalPages = getAdditionalPages(
    Boolean(data?.dataset?.bulkUsagesHasNext?.length),
    Boolean(data?.dataset?.bulkUsagesHasNextNext?.length)
  );

  const formattedTask =
    tasks?.map((task) => ({
      ...task,
      destination: `/task/${task.taskid}`,
    })) ?? [];

  return {
    data: formattedTask,
    isLoading,
    isRefetching,
    isError,
    additionalPages,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

export function DatasetTasksTable({
  datasetId,
  setLoading,
  setOutdated,
}: {
  datasetId: string;
  setLoading: (loading: boolean) => void;
  setOutdated: (outdated: boolean) => void;
}) {
  const [currentPage, setCurrentPage] = usePageParam('datasetTasksPage');
  const {
    data: tasks,
    isError,
    isLoading,
    isRefetching,
    additionalPages,
    hasPastError,
  } = useDatasetTasksData({ datasetId, currentPage: currentPage - 1 });

  useEffect(
    () => setLoading(isLoading || isRefetching),
    [isLoading, isRefetching, setLoading]
  );
  useEffect(
    () => setOutdated(tasks.length > 0 && isError),
    [tasks.length, isError, setOutdated]
  );

  return (
    <div className="space-y-6">
      {hasPastError && !tasks.length ? (
        <ErrorAlert message="An error occurred during dataset tasks loading." />
      ) : (
        <DataTable columns={columns} data={tasks} />
      )}
      <PaginatedNavigation
        currentPage={currentPage}
        totalPages={currentPage + additionalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
