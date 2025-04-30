'use client';

import { ColumnDef } from '@tanstack/react-table';
import CopyButton from '@/components/CopyButton';
import { formatElapsedTime } from '@/utils/formatElapsedTime';
import { truncateAddress } from '@/utils/truncateAddress';

export type App = {
  timestamp: any;
  name: string;
  type: string;
  multiaddr: any;
  checksum: any;
  mrenclave: any;
  address: string;
  owner: { address: string };
  transfers: Array<{
    transaction: {
      timestamp: any;
      blockNumber: any;
      txHash: string;
    };
  }>;
  destination: string;
};

export const columns: ColumnDef<App>[] = [
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => {
      const appAddress = row.getValue('address');
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
      const name = row.getValue('name');
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
