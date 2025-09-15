import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import TaskIcon from '@/components/icons/TaskIcon';
import { BackButton } from '@/components/ui/BackButton';
import { usePageParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { SearcherBar } from '@/modules/search/SearcherBar';
import { TaskBreadcrumbsList } from '@/modules/tasks/TaskBreadcrumbs';
import { tasksQuery } from '@/modules/tasks/tasksQuery';
import { columns } from '@/modules/tasks/tasksTable/columns';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { getAdditionalPages } from '@/utils/format';

export const Route = createFileRoute('/$chainSlug/_layout/tasks')({
  component: TasksRoute,
});

function useTasksData(currentPage: number) {
  const { chainId } = useUserStore();
  const skip = currentPage * TABLE_LENGTH;
  const nextSkip = skip + TABLE_LENGTH;
  const nextNextSkip = skip + 2 * TABLE_LENGTH;

  const queryKey = [chainId, 'tasks', currentPage];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(tasksQuery, chainId, {
          length: TABLE_LENGTH,
          skip,
          nextSkip,
          nextNextSkip,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      enabled: !!chainId,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  const tasks = data?.tasks ?? [];
  // 0 = only current, 1 = next, 2 = next+1
  const additionalPages = getAdditionalPages(
    Boolean(data?.tasksHasNext?.length),
    Boolean(data?.tasksHasNextNext?.length)
  );

  const formattedTasks =
    tasks.map((task) => ({
      ...task,
      destination: `/task/${task.taskid}`,
    })) ?? [];

  return {
    data: formattedTasks,
    isLoading,
    isRefetching,
    isError: isError,
    hasPastError: isError || errorUpdateCount > 0,
    additionalPages,
  };
}

function TasksRoute() {
  const [currentPage, setCurrentPage] = usePageParam('tasksPage');
  const {
    data,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
    additionalPages,
  } = useTasksData(currentPage - 1);

  return (
    <div className="mt-8 grid gap-6">
      <div className="flex flex-col justify-between lg:flex-row">
        <SearcherBar className="py-6 lg:order-last lg:mr-0 lg:max-w-md lg:py-0 xl:max-w-xl" />
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
            <TaskIcon size={24} />
            Tasks
            {data.length > 0 && isError && (
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
            <TaskBreadcrumbsList />
          </div>
        </div>
      </div>
      {hasPastError && !data.length ? (
        <ErrorAlert message="An error occurred during tasks loading." />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          tableLength={TABLE_LENGTH}
          isLoading={isLoading || isRefetching}
        />
      )}
      <PaginatedNavigation
        currentPage={currentPage}
        totalPages={currentPage + additionalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
