import { ColumnDef } from '@tanstack/react-table';
import { PublishedDatasetorder } from 'iexec/IExecOrderbookModule';
import CopyButton from '@/components/CopyButton';
import useUserStore from '@/stores/useUser.store';
import { getTokenSymbol } from '@/utils/chain.utils';
import { nrlcToRlc } from '@/utils/nrlcToRlc';
import { truncateAddress } from '@/utils/truncateAddress';

export const columns: ColumnDef<PublishedDatasetorder>[] = [
  {
    accessorKey: 'order.dataset',
    header: 'Dataset',
    cell: ({ row }) => (
      <CopyButton
        displayText={truncateAddress(row.original.order.dataset.toLowerCase(), {
          startLen: 8,
        })}
        textToCopy={row.original.order.dataset.toLowerCase()}
      />
    ),
  },
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
    accessorKey: 'order.workerpoolrestrict',
    header: 'Workerpool Restriction',
    cell: ({ row }) => (
      <CopyButton
        displayText={truncateAddress(
          row.original.order.workerpoolrestrict.toLowerCase(),
          {
            startLen: 8,
          }
        )}
        textToCopy={row.original.order.workerpoolrestrict.toLowerCase()}
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
