import { TasksQuery } from '@/graphql/graphql';
import { ColumnDef } from '@tanstack/react-table';
import CopyButton from '@/components/CopyButton';
import { truncateAddress } from '@/utils/truncateAddress';
import StatusCell from '../StatusCell';

type Task = TasksQuery['tasks'][number];

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'taskid',
    header: 'Task',
    cell: ({ row }) => {
      const taskAddress = row.original.taskid;
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
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const finalDeadlineTimestamp = row.original.finalDeadline * 1000;
      return (
        <StatusCell
          statusEnum={status}
          timeoutTimestamp={finalDeadlineTimestamp}
          bare
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
];
