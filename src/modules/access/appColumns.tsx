import { ColumnDef } from '@tanstack/react-table';
import { PublishedApporder } from 'iexec/IExecOrderbookModule';
import CopyButton from '@/components/CopyButton';
import useUserStore from '@/stores/useUser.store';
import { getTokenSymbol } from '@/utils/chain.utils';
import { truncateAddress } from '@/utils/truncateAddress';

export const columns: ColumnDef<PublishedApporder>[] = [
  {
    accessorKey: 'order.appprice',
    header: 'Price',
    cell: ({ row }) => (
      <span>
        {row.original.order.appprice}{' '}
        {getTokenSymbol(useUserStore.getState().chainId)}
      </span>
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
