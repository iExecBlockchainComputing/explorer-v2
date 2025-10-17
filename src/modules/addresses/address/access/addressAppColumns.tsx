import { ColumnDef } from '@tanstack/react-table';
import { PublishedApporder } from 'iexec/IExecOrderbookModule';
import CopyButton from '@/components/CopyButton';
import { truncateAddress } from '@/utils/truncateAddress';

export const columns: ColumnDef<PublishedApporder>[] = [
  {
    accessorKey: 'order.app',
    header: 'App',
    cell: ({ row }) => (
      <CopyButton
        displayText={truncateAddress(row.original.order.app, {
          startLen: 8,
        })}
        textToCopy={row.original.order.app}
      />
    ),
  },
  {
    accessorKey: 'order.appprice',
    header: 'Price',
    cell: ({ row }) => <span>{row.original.order.appprice}</span>,
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
    accessorKey: 'order.datasetrestrict',
    header: 'Dataset Restriction',
    cell: ({ row }) => (
      <CopyButton
        displayText={truncateAddress(row.original.order.datasetrestrict, {
          startLen: 8,
        })}
        textToCopy={row.original.order.datasetrestrict}
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
