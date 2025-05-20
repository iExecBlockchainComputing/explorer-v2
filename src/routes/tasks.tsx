import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Box, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { SearcherBar } from '@/modules/SearcherBar';
import { nextTasksQuery } from '@/modules/tasks/nextTasksQuery';
import { tasksQuery } from '@/modules/tasks/tasksQuery';
import { columns } from '@/modules/tasks/tasksTable/columns';
import useUserStore from '@/stores/useUser.store';

export const Route = createFileRoute('/tasks')({
  component: TasksRoute,
});

function useTasksData(currentPage: number) {
  const { subgraphUrl, chainId } = useUserStore();
  const skip = currentPage * TABLE_LENGTH;

  const { data, isLoading, isRefetching, isError } = useQuery({
    queryKey: [chainId, 'tasks', currentPage],
    queryFn: () =>
      execute(tasksQuery, subgraphUrl, { length: TABLE_LENGTH, skip }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
  });

  const { data: nextData } = useQuery({
    queryKey: [chainId, 'tasks-next', currentPage],
    queryFn: () =>
      execute(nextTasksQuery, subgraphUrl, {
        length: TABLE_LENGTH * 2,
        skip: (currentPage + 1) * TABLE_LENGTH,
      }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
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
    isError,
    additionalPages,
  };
}

function TasksRoute() {
  const [currentPage, setCurrentPage] = useState(0);
  const { data, isLoading, isRefetching, isError, additionalPages } =
    useTasksData(currentPage);

  return (
    <div className="mt-8 grid gap-6">
      <SearcherBar className="py-10" />

      <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
        <Box size="20" />
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

      <DataTable
        columns={columns}
        data={data}
        tableLength={TABLE_LENGTH}
        isLoading={isLoading || isRefetching}
      />
      <PaginatedNavigation
        currentPage={currentPage + 1}
        totalPages={currentPage + 1 + additionalPages}
        onPageChange={(newPage) => setCurrentPage(newPage - 1)}
      />
    </div>
  );
}
