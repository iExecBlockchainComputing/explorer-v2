import { PREVIEW_TABLE_LENGTH, PREVIEW_TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Box, LoaderCircle } from 'lucide-react';
import { ChainLink } from '@/components/ChainLink';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { ErrorAlert } from '../ErrorAlert';
import { tasksQuery } from './tasksQuery';
import { columns } from './tasksTable/columns';

export function TasksPreviewTable({ className }: { className?: string }) {
  const { chainId } = useUserStore();

  const queryKey = [chainId, 'tasks_preview'];
  const tasks = useQuery({
    queryKey,
    queryFn: () =>
      execute(tasksQuery, chainId, {
        length: PREVIEW_TABLE_LENGTH,
        skip: 0,
      }),
    refetchInterval: PREVIEW_TABLE_REFETCH_INTERVAL,
    enabled: !!chainId,
    placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
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
          <ChainLink to="/tasks">View all</ChainLink>
        </Button>
      </div>
      {(tasks.isError || tasks.errorUpdateCount > 0) && !tasks.data ? (
        <ErrorAlert message="An error occurred during tasks loading." />
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
