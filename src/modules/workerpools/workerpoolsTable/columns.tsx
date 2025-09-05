import { WorkerpoolsQuery } from '@/graphql/poco/graphql';
import { ColumnDef } from '@tanstack/react-table';
import CopyButton from '@/components/CopyButton';
import { formatElapsedTime } from '@/utils/formatElapsedTime';
import { truncateAddress } from '@/utils/truncateAddress';

type Workerpool = WorkerpoolsQuery['workerpools'][number];

export const columns: ColumnDef<Workerpool>[] = [
  {
    accessorKey: 'address',
    header: 'Workerpool',
    cell: ({ row }) => {
      const workerpoolAddress = row.original.address;
      return (
        <CopyButton
          displayText={truncateAddress(workerpoolAddress, {
            startLen: 8,
          })}
          textToCopy={workerpoolAddress}
        />
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const workerpoolDescription = row.original.description;
      return (
        <div className="w-42">
          <CopyButton
            displayText={workerpoolDescription}
            textToCopy={workerpoolDescription}
            tooltipWithText
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'owner.address',
    header: 'Owner',
    cell: ({ row }) => {
      const owner = row.original.owner.address;
      return (
        <CopyButton
          displayText={truncateAddress(owner, {
            startLen: 8,
          })}
          textToCopy={owner}
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
    accessorKey: 'txHash',
    header: 'TxHash',
    cell: ({ row }) => {
      const txHash = row.original.transfers[0].transaction.txHash;
      return (
        <CopyButton
          displayText={truncateAddress(txHash, {
            startLen: 8,
          })}
          textToCopy={txHash}
        />
      );
    },
  },
];
