import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import TaskIcon from '@/components/icons/taskIcon';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { SearcherBar } from '@/modules/search/SearcherBar';
import { nextTasksQuery } from '@/modules/tasks/nextTasksQuery';
import { tasksQuery } from '@/modules/tasks/tasksQuery';
import { columns } from '@/modules/tasks/tasksTable/columns';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

export const Route = createFileRoute('/$chainSlug/_layout/tasks')({
  component: TasksRoute,
});

function useTasksData(currentPage: number) {
  const { chainId } = useUserStore();
  const skip = currentPage * TABLE_LENGTH;

  const queryKey = [chainId, 'tasks', currentPage];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(tasksQuery, chainId, { length: TABLE_LENGTH, skip }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      enabled: !!chainId,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  const queryKeyNextData = [chainId, 'tasks-next', currentPage];
  const { data: nextData } = useQuery({
    queryKey: queryKeyNextData,
    queryFn: () =>
      execute(nextTasksQuery, chainId, {
        length: TABLE_LENGTH * 2,
        skip: (currentPage + 1) * TABLE_LENGTH,
      }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
    enabled: !!chainId,
    placeholderData: createPlaceholderDataFnForQueryKey(queryKeyNextData),
  });

  const nextTasks = nextData?.tasks ?? [];

  const additionalPages = Math.ceil(nextTasks.length / TABLE_LENGTH);

  const formattedData =
    data?.tasks.map((task) => ({
      ...task,
      destination: `/task/${task.taskid}`,
    })) ?? [];

  return {
    data: formattedData,
    isLoading,
    isRefetching,
    isError: isError,
    hasPastError: isError || errorUpdateCount > 0,
    additionalPages,
  };
}

function TasksRoute() {
  const [currentPage, setCurrentPage] = useState(0);
  const {
    data,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
    additionalPages,
  } = useTasksData(currentPage);

  return (
    <div className="mt-8 grid gap-6">
      <SearcherBar className="py-10" />

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
        currentPage={currentPage + 1}
        totalPages={currentPage + 1 + additionalPages}
        onPageChange={(newPage) => setCurrentPage(newPage - 1)}
      />
    </div>
  );
}
