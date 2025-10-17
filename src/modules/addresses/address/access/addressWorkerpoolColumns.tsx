import { ColumnDef } from '@tanstack/react-table';
import { PublishedWorkerpoolorder } from 'iexec/IExecOrderbookModule';
import CopyButton from '@/components/CopyButton';
import { truncateAddress } from '@/utils/truncateAddress';

export const columns: ColumnDef<PublishedWorkerpoolorder>[] = [
  {
    accessorKey: 'order.workerpool',
    header: 'Workerpool',
    cell: ({ row }) => (
      <CopyButton
        displayText={truncateAddress(row.original.order.workerpool, {
          startLen: 8,
        })}
        textToCopy={row.original.order.workerpool}
      />
    ),
  },
  {
    accessorKey: 'order.workerpoolprice',
    header: 'Price',
    cell: ({ row }) => <span>{row.original.order.workerpoolprice}</span>,
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
