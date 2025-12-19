import { ColumnDef } from '@tanstack/react-table';
import { PublishedWorkerpoolorder } from 'iexec/IExecOrderbookModule';
import { zeroAddress } from 'viem';
import CopyButton from '@/components/CopyButton';
import useUserStore from '@/stores/useUser.store';
import { getTokenSymbol } from '@/utils/chain.utils';
import { nrlcToRlc } from '@/utils/nrlcToRlc';
import { truncateAddress } from '@/utils/truncateAddress';

export const columns: ColumnDef<PublishedWorkerpoolorder>[] = [
  {
    accessorKey: 'order.workerpoolprice',
    header: 'Price',
    cell: ({ row }) => (
      <span>
        {nrlcToRlc(row.original.order.workerpoolprice)}{' '}
        {getTokenSymbol(useUserStore.getState().chainId)}
      </span>
    ),
  },
  {
    accessorKey: 'order.apprestrict',
    header: 'App Restriction',
    cell: ({ row }) => {
      const value = row.original.order.apprestrict.toLowerCase();
      if (value === zeroAddress) return <span>Not restricted</span>;
      return (
        <CopyButton
          displayText={truncateAddress(value, {
            startLen: 8,
          })}
          textToCopy={value}
        />
      );
    },
  },
  {
    accessorKey: 'order.requesterrestrict',
    header: 'Requester Restriction',
    cell: ({ row }) => {
      const value = row.original.order.requesterrestrict.toLowerCase();
      if (value === zeroAddress) return <span>Not restricted</span>;
      return (
        <CopyButton
          displayText={truncateAddress(value, {
            startLen: 8,
          })}
          textToCopy={value}
        />
      );
    },
  },
  {
    accessorKey: 'order.datasetrestrict',
    header: 'Dataset Restriction',
    cell: ({ row }) => {
      const value = row.original.order.datasetrestrict.toLowerCase();
      if (value === zeroAddress) return <span>Not restricted</span>;
      return (
        <CopyButton
          displayText={truncateAddress(value, {
            startLen: 8,
          })}
          textToCopy={value}
        />
      );
    },
  },
  {
    accessorKey: 'order.volume',
    header: 'Volume',
    cell: ({ row }) => <span>{row.original.order.volume}</span>,
  },
  {
    accessorKey: 'remaining',
    header: 'Remaining',
    cell: ({ row }) => <span>{row.original.remaining}</span>,
  },
];
