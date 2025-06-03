import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Box, LoaderCircle } from 'lucide-react';
import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { SearcherBar } from '@/modules/SearcherBar';
import { TaskBreadcrumbs } from '@/modules/tasks/task/TaskBreadcrumbs';
import { buildTaskDetails } from '@/modules/tasks/task/buildTaskDetails';
import { taskQuery } from '@/modules/tasks/task/taskQuery';
import useUserStore from '@/stores/useUser.store';

export const Route = createFileRoute('/$chainSlug/_layout/task/$taskAddress')({
  component: TasksRoute,
});

function useTaskData(taskAddress: string, chainId: number) {
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey: ['task', taskAddress],
      queryFn: () =>
        execute(taskQuery, chainId, { length: TABLE_LENGTH, taskAddress }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: keepPreviousData,
    }
  );

  return {
    data: data?.task,
    isLoading,
    isRefetching,
    isError,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

function TasksRoute() {
  const { chainId, isConnected } = useUserStore();
  const { taskAddress } = Route.useParams();
  const {
    data: task,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
  } = useTaskData(taskAddress, chainId);

  // if (!task) {
  //   return <p>Hum there is nothing here..</p>;
  // }
  const taskDetails = task
    ? buildTaskDetails({ task, isConnected })
    : undefined;

  return (
    <div className="mt-8 flex flex-col gap-6">
      <SearcherBar className="py-10" />

      <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
        <Box size="20" />
        Task details
        {!task && isError && (
          <span className="text-muted-foreground text-sm font-light">
            (outdated)
          </span>
        )}
        {(isLoading || isRefetching) && (
          <LoaderCircle className="animate-spin" />
        )}
      </h1>
      <TaskBreadcrumbs taskId={taskAddress} />
      {hasPastError && !taskDetails ? (
        <ErrorAlert message="An error occurred during task details  loading." />
      ) : (
        <DetailsTable details={taskDetails} />
      )}
    </div>
  );
}
