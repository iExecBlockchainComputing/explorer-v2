import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import TaskIcon from '@/components/icons/TaskIcon';
import { BackButton } from '@/components/ui/BackButton';
import { useTabParam } from '@/hooks/usePageParam';
import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { Tabs } from '@/modules/Tabs';
import { SearcherBar } from '@/modules/search/SearcherBar';
import { TaskBreadcrumbs } from '@/modules/tasks/task/TaskBreadcrumbs';
import { TaskDatasetsTable } from '@/modules/tasks/task/TaskDatasetsTable';
import { TaskRawData } from '@/modules/tasks/task/TaskRawData';
import { buildTaskDetails } from '@/modules/tasks/task/buildTaskDetails';
import { taskDatasetsQuery } from '@/modules/tasks/task/taskDatasetsQuery';
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
  const tabLabels = ['DETAILS', 'RAW DATA', 'DATASETS'];
  const [currentTab, setCurrentTab] = useTabParam('dealTab', tabLabels, 0);

  const [isLoadingChild, setIsLoadingChild] = useState(false);
  const [isOutdatedChild, setIsOutdatedChild] = useState(false);

  const taskDetails = task ? buildTaskDetails({ task }) : undefined;

  if (!isValid) {
    return <ErrorAlert className="my-16" message="Invalid task address." />;
  }

  if (isError && error instanceof NotFoundError) {
    return <ErrorAlert message="Task not found." />;
  }

  // Presence check for datasets to disable tab if none
  const datasetsPresenceQueryKey = [
    chainId,
    'task',
    'datasetsPresence',
    taskId,
  ];
  const { data: datasetsPresence } = useQuery({
    queryKey: datasetsPresenceQueryKey,
    enabled: !!chainId && !!task && currentTab !== 2,
    queryFn: () =>
      execute(taskDatasetsQuery, chainId!, {
        taskId: (taskId as string).toLowerCase(),
        length: 1,
        skip: 0,
        nextSkip: 1,
        nextNextSkip: 2,
      }),
    placeholderData: (prev) => prev,
  });
  const hasDatasets =
    (datasetsPresence?.task?.bulkSlice?.datasets?.length || 0) > 0;

  const showOutdated = task && (isError || isOutdatedChild);
  const showLoading = isLoading || isRefetching || isLoadingChild;

  return (
    <div className="mt-8 flex flex-col gap-6">
      <div className="mt-6 flex flex-col justify-between lg:flex-row">
        <SearcherBar className="py-6 lg:order-last lg:mr-0 lg:max-w-md lg:py-0 xl:max-w-xl" />
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
            <TaskIcon size={24} />
            Task details
            {showOutdated && (
              <span className="text-muted-foreground text-sm font-light">
                (outdated)
              </span>
            )}
            {showLoading && <LoaderCircle className="animate-spin" />}
          </h1>
          <div className="flex items-center gap-2">
            <BackButton />
            <TaskBreadcrumbs taskId={taskId} />
          </div>
        </div>
      </div>

      <Tabs
        currentTab={currentTab}
        tabLabels={tabLabels}
        onTabChange={setCurrentTab}
        disabledTabs={task && !hasDatasets ? [2] : []}
        disabledReasons={
          task && !hasDatasets ? { 2: 'No datasets for this task' } : {}
        }
      />
      <div>
        {currentTab === 0 &&
          (hasPastError && !taskDetails ? (
            <ErrorAlert message="An error occurred during task details loading." />
          ) : (
            <DetailsTable details={taskDetails || {}} />
          ))}
        {currentTab === 1 && (
          <TaskRawData
            taskWorkerpoolId={task?.deal.workerpool.address}
            taskId={taskId}
            setLoading={setIsLoadingChild}
            setOutdated={setIsOutdatedChild}
          />
        )}
        {currentTab === 2 && (
          <TaskDatasetsTable
            taskId={taskId}
            setLoading={setIsLoadingChild}
            setOutdated={setIsOutdatedChild}
          />
        )}
      </div>
    </div>
  );
}
