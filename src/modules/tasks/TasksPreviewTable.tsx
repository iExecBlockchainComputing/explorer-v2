import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Box, Terminal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { execute } from "@/graphql/execute";
import { CircularLoader } from "@/components/CircularLoader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PREVIEW_TABLE_LENGTH } from "@/config";
import CopyButton from "@/components/CopyButton";
import { truncateAddress } from "@/utils/truncateAddress";
import { taskQuery } from "./tasksQuery";
import StatusCell from "./StatusCell";

export function TasksPreviewTable() {
  const tasks = useQuery({
    queryKey: ["tasks_preview"],
    queryFn: () =>
      execute(taskQuery, { length: PREVIEW_TABLE_LENGTH, skip: 0 }),
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans">
          <Box size="16" className="text-secondary" />
          Latest tasks
        </h2>
        <Button variant="link">View all tasks</Button>
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
          {tasks.isLoading || tasks.isError || !tasks.data?.tasks.length ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                {tasks.isLoading ? (
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
                className="[&>td]:min-w-24 [&>td]:overflow-ellipsis [&>td]:overflow-hidden"
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
                  {new Intl.DateTimeFormat("en-US", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
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
