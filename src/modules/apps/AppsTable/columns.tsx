'use client';

import { Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import CopyButton from '@/components/CopyButton';
import { formatElapsedTime } from '@/utils/formatElapsedTime';
import { truncateAddress } from '@/utils/truncateAddress';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
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
      return <CopyButton displayText={name} textToCopy={name} />;
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
      return formatElapsedTime(timestamp);
    },
  },
];
