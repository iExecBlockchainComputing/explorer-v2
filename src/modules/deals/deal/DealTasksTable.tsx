import { DETAIL_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/DataTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/tasks/tasksTable/columns';
import useUserStore from '@/stores/useUser.store';
import { dealTasksQuery } from './dealTasksQuery';

function useDealTasksData({ dealAddress }: { dealAddress: string }) {
  const { chainId } = useUserStore();

  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey: [chainId, 'deal', 'tasks', dealAddress],
      queryFn: () =>
        execute(dealTasksQuery, chainId, {
          length: DETAIL_TABLE_LENGTH,
          dealAddress,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: keepPreviousData,
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

export function DealTasksTable({ dealAddress }: { dealAddress: string }) {
  const { data: tasks, hasPastError } = useDealTasksData({ dealAddress });

  // TODO: handle loading state

  const extendedColumns = [
    {
      accessorKey: 'index',
      header: 'Index',
      cell: ({ row }) => {
        const index = row.getValue('index');
        return <>{index}</>;
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
