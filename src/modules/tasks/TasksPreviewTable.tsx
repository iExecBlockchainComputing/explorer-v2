import { PREVIEW_TABLE_LENGTH, PREVIEW_TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Box, LoaderCircle, Terminal } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import useUserStore from '@/stores/useUser.store';
import { tasksQuery } from './tasksQuery';
import { columns } from './tasksTable/columns';

export function TasksPreviewTable({ className }: { className?: string }) {
  const { subgraphUrl, chainId } = useUserStore();
  const tasks = useQuery({
    queryKey: [chainId, 'tasks_preview'],
    queryFn: () =>
      execute(tasksQuery, subgraphUrl, {
        length: PREVIEW_TABLE_LENGTH,
        skip: 0,
      }),
    refetchInterval: PREVIEW_TABLE_REFETCH_INTERVAL,
  });

  const formattedData =
    tasks.data?.tasks.map((task) => ({
      ...task,
      destination: `/task/${task.taskid}`,
    })) ?? [];

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans">
          <Box size="16" className="text-secondary" />
          Latest tasks
          {tasks.data && tasks.isError && (
            <span className="text-muted-foreground text-sm font-light">
              (outdated)
            </span>
          )}
          {tasks.isFetching && <LoaderCircle className="animate-spin" />}
        </h2>
        <Button variant="link" className="-mr-4" asChild>
          <Link to="/tasks">View all</Link>
        </Button>
      </div>
      {(tasks.isError || tasks.errorUpdateCount > 0) && !tasks.data ? (
        <Alert variant="destructive" className="mx-auto w-fit text-left">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            A error occurred during tasks loading.
          </AlertDescription>
        </Alert>
      ) : (
        <DataTable
          columns={columns}
          data={formattedData}
          tableLength={PREVIEW_TABLE_LENGTH}
          isLoading={tasks.isLoading || tasks.isRefetching}
        />
      )}
    </div>
  );
}
