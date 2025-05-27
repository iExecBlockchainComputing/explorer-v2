import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/DataTable';
import useUserStore from '@/stores/useUser.store';
import { columns } from './dealTaskColumns';
import { dealTasksQuery } from './dealTasksQuery';

function useDealTasksData({ dealAddress }: { dealAddress: string }) {
  const { chainId } = useUserStore();

  const { data, isLoading, isRefetching, isError } = useQuery({
    queryKey: ['deal', 'tasks', dealAddress],
    queryFn: () =>
      execute(dealTasksQuery, chainId, { length: TABLE_LENGTH, dealAddress }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
    placeholderData: keepPreviousData,
  });

  console.log('dealTasksQuery', data);

  const formattedTask =
    data?.deal?.tasks.map((task) => ({
      ...task,
      destination: `/task/${task.taskid}`,
    })) ?? [];

  return { data: formattedTask, isLoading, isRefetching, isError };
}

export function DealTasksTable({ dealAddress }: { dealAddress: string }) {
  const { data: tasks } = useDealTasksData({ dealAddress });

  // TODO: handle error and loading state

  return <DataTable columns={columns} data={tasks} />;
}
