import { DealsQuery } from '@/graphql/graphql';
import { ColumnDef } from '@tanstack/react-table';
import CopyButton from '@/components/CopyButton';
import { formatElapsedTime } from '@/utils/formatElapsedTime';
import { truncateAddress } from '@/utils/truncateAddress';
import { SuccessCell } from '../SuccessCell';

type Deal = DealsQuery['deals'][number];

export const columns: ColumnDef<Deal>[] = [
  {
    accessorKey: 'dealid',
    header: 'Deal',
    cell: ({ row }) => {
      const dealAddress = row.original.dealid;
      return (
        <CopyButton
          displayText={truncateAddress(dealAddress, {
            startLen: 8,
          })}
          textToCopy={dealAddress}
        />
      );
    },
  },
  {
    accessorKey: 'app',
    header: 'App',
    cell: ({ row }) => {
      const appAddress = row.original.app.address;
      return (
        <div className="w-36">
          <CopyButton
            displayText={truncateAddress(appAddress, {
              startLen: 8,
            })}
            textToCopy={appAddress}
          />
        </div>
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
  {
    accessorKey: 'workerpool.address',
    header: 'Workerpool',
    cell: ({ row }) => {
      const workerpoolAddress = row.original.workerpool.address;
      return (
        <CopyButton
          displayText={truncateAddress(workerpoolAddress, {
            startLen: 8,
          })}
          textToCopy={workerpoolAddress}
        />
      );
    },
  },
  {
    accessorKey: 'dataset.address',
    header: 'Dataset',
    cell: ({ row }) => {
      const datasetAddress = row.original.dataset?.address;
      if (!datasetAddress) {
        return <span className="text-muted-foreground">No dataset</span>;
      }
      return (
        <CopyButton
          displayText={truncateAddress(datasetAddress, {
            startLen: 8,
          })}
          textToCopy={datasetAddress}
        />
      );
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = (
        Number(row.original.appPrice) +
        Number(row.original.datasetPrice) +
        Number(row.original.workerpoolPrice)
      ).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 10,
      });
      return <span>{price} xRLC</span>;
    },
  },
  {
    accessorKey: 'success',
    header: 'Success',
    cell: ({ row }) => {
      return <SuccessCell deal={row.original} />;
    },
  },
];
