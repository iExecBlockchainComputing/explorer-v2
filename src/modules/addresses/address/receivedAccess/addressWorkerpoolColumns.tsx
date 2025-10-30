import { ColumnDef } from '@tanstack/react-table';
import { PublishedWorkerpoolorder } from 'iexec/IExecOrderbookModule';
import CopyButton from '@/components/CopyButton';
import useUserStore from '@/stores/useUser.store';
import { getTokenSymbol } from '@/utils/chain.utils';
import { nrlcToRlc } from '@/utils/nrlcToRlc';
import { truncateAddress } from '@/utils/truncateAddress';

export const columns: ColumnDef<PublishedWorkerpoolorder>[] = [
  {
    accessorKey: 'order.workerpool',
    header: 'Workerpool',
    cell: ({ row }) => (
      <CopyButton
        displayText={truncateAddress(
          row.original.order.workerpool.toLowerCase(),
          {
            startLen: 8,
          }
        )}
        textToCopy={row.original.order.workerpool.toLowerCase()}
      />
    ),
  },
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
    accessorKey: 'order.requesterrestrict',
    header: 'Requester Restriction',
    cell: ({ row }) => (
      <CopyButton
        displayText={truncateAddress(
          row.original.order.requesterrestrict.toLowerCase(),
          {
            startLen: 8,
          }
        )}
        textToCopy={row.original.order.requesterrestrict.toLowerCase()}
      />
    ),
  },
  {
    accessorKey: 'order.datasetrestrict',
    header: 'Dataset Restriction',
    cell: ({ row }) => (
      <CopyButton
        displayText={truncateAddress(
          row.original.order.datasetrestrict.toLowerCase(),
          {
            startLen: 8,
          }
        )}
        textToCopy={row.original.order.datasetrestrict.toLowerCase()}
      />
    ),
  },
  {
    accessorKey: 'order.apprestrict',
    header: 'App Restriction',
    cell: ({ row }) => (
      <CopyButton
        displayText={truncateAddress(
          row.original.order.apprestrict.toLowerCase(),
          {
            startLen: 8,
          }
        )}
        textToCopy={row.original.order.apprestrict.toLowerCase()}
      />
    ),
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
