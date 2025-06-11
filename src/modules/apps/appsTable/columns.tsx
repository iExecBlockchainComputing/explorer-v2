import { AppsQuery } from '@/graphql/graphql';
import { ColumnDef } from '@tanstack/react-table';
import CopyButton from '@/components/CopyButton';
import { formatElapsedTime } from '@/utils/formatElapsedTime';
import { truncateAddress } from '@/utils/truncateAddress';

type App = AppsQuery['apps'][number];

export const columns: ColumnDef<App>[] = [
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => {
      const appAddress = row.original.address;
      return (
        <CopyButton
          displayText={truncateAddress(appAddress, {
            startLen: 8,
          })}
          textToCopy={appAddress}
        />
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const name = row.original.name;
      return (
        <div className="w-36">
          <CopyButton displayText={name} textToCopy={name} />
        </div>
      );
    },
  },
  {
    accessorKey: 'owner.address',
    header: 'Owner',
    cell: ({ row }) => {
      const ownerAddress = row.original.owner.address;
      return (
        <CopyButton
          displayText={truncateAddress(ownerAddress, {
            startLen: 8,
          })}
          textToCopy={ownerAddress}
        />
      );
    },
  },
  {
    accessorKey: 'tx_hash',
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
  {
    accessorKey: 'time',
    header: 'Time',
    cell: ({ row }) => {
      const timestamp = row.original.timestamp;
      return <div className="min-w-32">{formatElapsedTime(timestamp)}</div>;
    },
  },
];
