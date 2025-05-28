import { DETAIL_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Terminal } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import useUserStore from '@/stores/useUser.store';
import { columns } from './dealTaskColumns';
import { dealTasksQuery } from './dealTasksQuery';

function useDealTasksData({ dealAddress }: { dealAddress: string }) {
  const { chainId } = useUserStore();

  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey: ['deal', 'tasks', dealAddress],
      queryFn: () =>
        execute(dealTasksQuery, chainId, { length: DETAIL_TABLE_LENGTH, dealAddress }),
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

  return hasPastError && !tasks.length ? (
    <Alert variant="destructive" className="mx-auto w-fit text-left">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        An error occurred during deal tasks loading.
      </AlertDescription>
    </Alert>
  ) : (
    <DataTable columns={columns} data={tasks} />
  );
}
