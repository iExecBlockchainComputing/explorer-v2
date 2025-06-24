import { AddressContributionQuery } from '@/graphql/graphql';
import { ColumnDef } from '@tanstack/react-table';
import CopyButton from '@/components/CopyButton';
import StatusCell from '@/modules/tasks/StatusCell';
import { formatElapsedTime } from '@/utils/formatElapsedTime';
import { truncateAddress } from '@/utils/truncateAddress';

type AddressContribution = NonNullable<
  NonNullable<AddressContributionQuery['account']>['contributions']
>[number];

export const columns: ColumnDef<AddressContribution>[] = [
  {
    accessorKey: 'taskid',
    header: 'Task',
    cell: ({ row }) => {
      const taskAddress = row.original.task.taskid;
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
    accessorKey: 'time',
    header: 'Time',
    cell: ({ row }) => {
      const timestamp = row.original.timestamp;
      return <div className="min-w-18">{formatElapsedTime(timestamp)}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return <StatusCell statusEnum={status} bare />;
    },
  },
];
