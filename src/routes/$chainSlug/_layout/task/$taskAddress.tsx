import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import TaskIcon from '@/components/icons/TaskIcon';
import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { SearcherBar } from '@/modules/search/SearcherBar';
import { TaskBreadcrumbs } from '@/modules/tasks/task/TaskBreadcrumbs';
import { buildTaskDetails } from '@/modules/tasks/task/buildTaskDetails';
import { taskQuery } from '@/modules/tasks/task/taskQuery';
import useUserStore from '@/stores/useUser.store';
import { NotFoundError } from '@/utils/NotFoundError';
import { isValidTaskAddress } from '@/utils/addressOrIdCheck';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

export const Route = createFileRoute('/$chainSlug/_layout/task/$taskAddress')({
  component: TasksRoute,
});

function useTaskData(taskAddress: string, chainId: number) {
  const isValid = isValidTaskAddress(taskAddress);
  const queryKey = [chainId, 'task', taskAddress];
  const { data, isLoading, isRefetching, isError, error, errorUpdateCount } =
    useQuery({
      queryKey,
      enabled: !!chainId && isValid,
      queryFn: async () => {
        const result = await execute(taskQuery, chainId, {
          length: TABLE_LENGTH,
          taskAddress,
        });
        if (!result?.task) {
          throw new NotFoundError();
        }
        return result;
      },
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    });

  return {
    data: data?.task,
    isLoading,
    isRefetching,
    isError,
    error,
    hasPastError: isError || errorUpdateCount > 0,
    isValid,
  };
}

function TasksRoute() {
  const { chainId } = useUserStore();
  const { taskAddress } = Route.useParams();
  const {
    data: task,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
    isValid,
    error,
  } = useTaskData(taskAddress, chainId!);

  const taskDetails = task ? buildTaskDetails({ task }) : undefined;

  if (!isValid) {
    return <ErrorAlert className="my-16" message="Invalid task address." />;
  }

  if (isError && error instanceof NotFoundError) {
    return <ErrorAlert message="Task not found." />;
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      <SearcherBar className="py-10" />

      <div className="space-y-2">
        <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
          <TaskIcon size={24} />
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
      </div>

      {hasPastError && !taskDetails ? (
        <ErrorAlert message="An error occurred during task details loading." />
      ) : (
        <DetailsTable details={taskDetails || {}} />
      )}
    </div>
  );
}
