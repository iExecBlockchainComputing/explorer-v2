import { ColumnDef } from '@tanstack/react-table';
import { PublishedDatasetorder } from 'iexec/IExecOrderbookModule';
import { zeroAddress } from 'viem';
import CopyButton from '@/components/CopyButton';
import useUserStore from '@/stores/useUser.store';
import { getTokenSymbol } from '@/utils/chain.utils';
import { nrlcToRlc } from '@/utils/nrlcToRlc';
import { truncateAddress } from '@/utils/truncateAddress';

export const columns: ColumnDef<PublishedDatasetorder>[] = [
  {
    accessorKey: 'order.datasetprice',
    header: 'Price',
    cell: ({ row }) => (
      <span>
        {nrlcToRlc(row.original.order.datasetprice)}{' '}
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
    accessorKey: 'order.workerpoolrestrict',
    header: 'Workerpool Restriction',
    cell: ({ row }) => {
      const value = row.original.order.workerpoolrestrict.toLowerCase();
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
