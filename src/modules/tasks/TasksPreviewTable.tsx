import { PREVIEW_TABLE_LENGTH, PREVIEW_TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { Box, LoaderCircle, Terminal } from 'lucide-react';
import { CircularLoader } from '@/components/CircularLoader';
import CopyButton from '@/components/CopyButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { truncateAddress } from '@/utils/truncateAddress';
import StatusCell from './StatusCell';
import { taskQuery } from './tasksQuery';

export function TasksPreviewTable() {
  const tasks = useQuery({
    queryKey: ['tasks_preview'],
    queryFn: () =>
      execute(taskQuery, { length: PREVIEW_TABLE_LENGTH, skip: 0 }),
    refetchInterval: PREVIEW_TABLE_REFETCH_INTERVAL,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans">
          <Box size="16" className="text-secondary" />
          Latest tasks
          {tasks.data && tasks.isError && (
            <span className="text-muted-foreground text-sm font-light">
              (outdated)
            </span>
          )}
          {tasks.isFetching && !tasks.isPending && (
            <LoaderCircle className="animate-spin" />
          )}
        </h2>
        <Button variant="link" className="-mr-4">
          View all
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.isPending ||
          (tasks.isError && !tasks.data) ||
          !tasks.data?.tasks.length ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center">
                {tasks.isPending ? (
                  <CircularLoader />
                ) : tasks.isError ? (
                  <Alert
                    variant="destructive"
                    className="mx-auto w-fit text-left"
                  >
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      A error occurred during tasks loading.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <p>No tasks to display.</p>
                )}
              </TableCell>
            </TableRow>
          ) : (
            tasks.data.tasks.map((task) => (
              <TableRow
                key={task.taskid}
                className="[&>td]:min-w-24 [&>td]:overflow-hidden [&>td]:overflow-ellipsis"
              >
                <TableCell>
                  <CopyButton
                    displayText={truncateAddress(task.taskid, {
                      startLen: 8,
                    })}
                    textToCopy={task.taskid}
                  />
                </TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(new Date(task.finalDeadline * 1000))}
                </TableCell>
                <TableCell>
                  <StatusCell
                    statusEnum={task.status}
                    timeoutTimestamp={task.finalDeadline * 1000}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
