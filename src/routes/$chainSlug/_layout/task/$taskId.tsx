import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import TaskIcon from '@/components/icons/TaskIcon';
import { BackButton } from '@/components/ui/BackButton';
import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { SearcherBar } from '@/modules/search/SearcherBar';
import { TaskBreadcrumbs } from '@/modules/tasks/task/TaskBreadcrumbs';
import { buildTaskDetails } from '@/modules/tasks/task/buildTaskDetails';
import { taskQuery } from '@/modules/tasks/task/taskQuery';
import useUserStore from '@/stores/useUser.store';
import { NotFoundError } from '@/utils/NotFoundError';
import { isValidId } from '@/utils/addressOrIdCheck';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

export const Route = createFileRoute('/$chainSlug/_layout/task/$taskId')({
  component: TasksRoute,
});

function useTaskData(taskId: string, chainId: number) {
  const isValid = isValidId(taskId);
  const queryKey = [chainId, 'task', taskId];
  const { data, isLoading, isRefetching, isError, error, errorUpdateCount } =
    useQuery({
      queryKey,
      enabled: !!chainId && isValid,
      queryFn: async () => {
        const result = await execute(taskQuery, chainId, {
          length: TABLE_LENGTH,
          taskId,
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
  const { taskId } = Route.useParams();
  const {
    data: task,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
    isValid,
    error,
  } = useTaskData((taskId as string).toLowerCase(), chainId!);

  const taskDetails = task ? buildTaskDetails({ task }) : undefined;

  if (!isValid) {
    return <ErrorAlert className="my-16" message="Invalid task address." />;
  }

  if (isError && error instanceof NotFoundError) {
    return <ErrorAlert message="Task not found." />;
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      <div className="flex flex-col justify-between lg:flex-row">
        <SearcherBar className="py-6 lg:order-last lg:mr-0 lg:max-w-md lg:py-0" />
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
          <div className="flex items-center gap-2">
            <BackButton />
            <TaskBreadcrumbs taskId={taskId} />
          </div>
        </div>
      </div>

      {hasPastError && !taskDetails ? (
        <ErrorAlert message="An error occurred during task details loading." />
      ) : (
        <DetailsTable details={taskDetails || {}} />
      )}
    </div>
  );
}
