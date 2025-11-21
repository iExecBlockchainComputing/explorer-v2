import { DETAIL_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { TasksQuery } from '@/graphql/poco/graphql';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { usePageParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/tasks/tasksTable/columns';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { getAdditionalPages } from '@/utils/format';
import { dealTasksQuery } from './dealTasksQuery';

type BaseTask = TasksQuery['tasks'][number];
interface DealTask extends BaseTask {
  index: number;
  destination: string;
}

function useDealTasksData({
  dealId,
  currentPage,
}: {
  dealId: string;
  currentPage: number;
}) {
  const { chainId } = useUserStore();
  const skip = currentPage * DETAIL_TABLE_LENGTH;
  const nextSkip = skip + DETAIL_TABLE_LENGTH;
  const nextNextSkip = skip + 2 * DETAIL_TABLE_LENGTH;

  const queryKey = [chainId, 'deal', 'tasks', dealId, currentPage];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(dealTasksQuery, chainId, {
          length: DETAIL_TABLE_LENGTH,
          skip,
          nextSkip,
          nextNextSkip,
          dealId,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  const tasksFromQuery = (data?.deal?.tasks || []) as BaseTask[];
  const additionalPages = getAdditionalPages(
    Boolean(data?.deal?.tasksHasNext?.length),
    Boolean(data?.deal?.tasksHasNextNext?.length)
  );

  const formattedTask: DealTask[] = tasksFromQuery.map((task) => ({
    ...task,
    destination: `/task/${task.taskid}`,
  }));

  return {
    data: formattedTask,
    isLoading,
    isRefetching,
    isError,
    additionalPages,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

export function DealTasksTable({
  dealId,
  setLoading,
  setOutdated,
}: {
  dealId: string;
  setLoading: (isLoading: boolean) => void;
  setOutdated: (isOutdated: boolean) => void;
}) {
  const [currentPage, setCurrentPage] = usePageParam('dealTasksPage');
  const {
    data: tasks,
    isError,
    isLoading,
    isRefetching,
    hasPastError,
    additionalPages,
  } = useDealTasksData({ dealId, currentPage: currentPage - 1 });

  useEffect(
    () => setLoading(isLoading || isRefetching),
    [isLoading, isRefetching, setLoading]
  );
  useEffect(
    () => setOutdated(tasks.length > 0 && isError),
    [tasks.length, isError, setOutdated]
  );

  const extendedColumns: ColumnDef<DealTask>[] = [
    {
      accessorKey: 'index',
      header: 'Index',
      cell: ({ row }) => <span>{row.original.index}</span>,
    },
    ...(columns as unknown as ColumnDef<DealTask>[]),
  ];

  return (
    <div className="space-y-6">
      {hasPastError && !tasks.length ? (
        <ErrorAlert message="An error occurred during deal tasks loading." />
      ) : (
        <DataTable columns={extendedColumns} data={tasks} />
      )}
      <PaginatedNavigation
        currentPage={currentPage}
        totalPages={currentPage + additionalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
