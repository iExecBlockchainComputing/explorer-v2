import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Box, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { PaginatedNavigation } from '@/components/PaginatedNavigation.tsx';
import { DataTable } from '@/components/data-table';
import { SearcherBar } from '@/modules/SearcherBar';
import { tasksQuery } from '@/modules/tasks/tasksQuery';
import { columns } from '@/modules/tasks/tasksTable/columns';

export const Route = createFileRoute('/tasks/')({
  component: TasksRoute,
});

function useTasksData(currentPage: number) {
  const skip = currentPage * TABLE_LENGTH;

  const { data, isLoading, isRefetching, isError } = useQuery({
    queryKey: ['tasks', currentPage],
    queryFn: () => execute(tasksQuery, { length: TABLE_LENGTH, skip }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
    placeholderData: keepPreviousData,
  });

  const formattedData =
    data?.tasks.map((task) => ({
      ...task,
      destination: `/tasks/${task.taskid}`,
    })) ?? [];

  return { data: formattedData, isLoading, isRefetching, isError };
}

function TasksRoute() {
  const [currentPage, setCurrentPage] = useState(0);
  const { data, isLoading, isRefetching, isError } = useTasksData(currentPage);

  return (
    <div className="mt-8 grid gap-6">
      <SearcherBar className="py-16" />

      <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
        <Box size="20" />
        Tasks
        {data.length > 0 && isError && (
          <span className="text-muted-foreground text-sm font-light">
            (outdated)
          </span>
        )}
        {(isLoading || isRefetching) && <LoaderCircle className="animate-spin" />}
      </h1>

      <DataTable columns={columns} data={data} />
      <PaginatedNavigation
        currentPage={currentPage}
        totalPages={currentPage + 2}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
