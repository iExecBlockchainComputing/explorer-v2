import { ColumnDef } from '@tanstack/react-table';
import { PublishedDatasetorder } from 'iexec/IExecOrderbookModule';
import CopyButton from '@/components/CopyButton';
import { truncateAddress } from '@/utils/truncateAddress';

export const columns: ColumnDef<PublishedDatasetorder>[] = [
  {
    accessorKey: 'order.apprestrict',
    header: 'App Restriction',
    cell: ({ row }) => (
      <CopyButton
        displayText={truncateAddress(row.original.order.apprestrict, {
          startLen: 8,
        })}
        textToCopy={row.original.order.apprestrict}
      />
    ),
  },
  {
    accessorKey: 'order.requesterrestrict',
    header: 'Requester Restriction',
    cell: ({ row }) => (
      <CopyButton
        displayText={truncateAddress(row.original.order.requesterrestrict, {
          startLen: 8,
        })}
        textToCopy={row.original.order.requesterrestrict}
      />
    ),
  },
  {
    accessorKey: 'order.workerpoolrestrict',
    header: 'Workerpool Restriction',
    cell: ({ row }) => (
      <CopyButton
        displayText={truncateAddress(row.original.order.workerpoolrestrict, {
          startLen: 8,
        })}
        textToCopy={row.original.order.workerpoolrestrict}
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
