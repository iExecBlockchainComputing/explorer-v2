import { DETAIL_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/DataTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/tasks/tasksTable/columns';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { dealTasksQuery } from './dealTasksQuery';

function useDealTasksData({ dealId }: { dealId: string }) {
  const { chainId } = useUserStore();

  const queryKey = [chainId, 'deal', 'tasks', dealId];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(dealTasksQuery, chainId, {
          length: DETAIL_TABLE_LENGTH,
          dealId,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  const formattedTask =
    data?.deal?.tasks.map((task) => ({
      ...task,
      destination: `/task/${task.taskid}`,
    })) ?? [];

  return {
    data: formattedTask,
    isLoading,
    isRefetching,
    isError,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

export function DealTasksTable({ dealId }: { dealId: string }) {
  const { data: tasks, hasPastError } = useDealTasksData({ dealId });

  // TODO: handle loading state

  const extendedColumns = [
    {
      accessorKey: 'index',
      header: 'Index',
      cell: ({ row }) => {
        const index = row.getValue('index');
        return <span>{index}</span>;
      },
    },
    ...columns,
  ];

  return hasPastError && !tasks.length ? (
    <ErrorAlert message="An error occurred during deal tasks loading." />
  ) : (
    <DataTable columns={extendedColumns} data={tasks} />
  );
}
