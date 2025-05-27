import { TasksQuery } from '@/graphql/graphql';
import { ColumnDef } from '@tanstack/react-table';
import CopyButton from '@/components/CopyButton';
import StatusCell from '@/modules/tasks/StatusCell';
import { truncateAddress } from '@/utils/truncateAddress';

type Task = TasksQuery['tasks'][number];

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'index',
    header: 'Index',
    cell: ({ row }) => {
      const index = row.getValue('index');
      return <>{index}</>;
    },
  },
  {
    accessorKey: 'taskid',
    header: 'Task',
    cell: ({ row }) => {
      const taskAddress = row.getValue('taskid');
      return (
        <CopyButton
          displayText={truncateAddress(taskAddress, {
            startLen: 8,
          })}
          textToCopy={taskAddress}
        />
      );
    },
  },
  {
    accessorKey: 'deadline',
    header: 'Deadline',
    cell: ({ row }) => {
      const deadline = new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(row.original.finalDeadline * 1000));
      return deadline;
    },
  },
  {
    accessorKey: 'workerpool.address',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const finalDeadlineTimestamp = row.original.finalDeadline * 1000;
      return (
        <StatusCell
          statusEnum={status}
          timeoutTimestamp={finalDeadlineTimestamp}
        />
      );
    },
  },
];
