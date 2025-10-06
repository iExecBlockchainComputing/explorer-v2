import { DealsQuery } from '@/graphql/poco/graphql';
import { ColumnDef } from '@tanstack/react-table';
import CopyButton from '@/components/CopyButton';
import useUserStore from '@/stores/useUser.store';
import { getChainFromId } from '@/utils/chain.utils';
import { formatElapsedTime } from '@/utils/formatElapsedTime';
import { truncateAddress } from '@/utils/truncateAddress';
import { SuccessCell } from '../SuccessCell';

type Deal = DealsQuery['deals'][number];

const getTokenSymbol = () => {
  const chainId = useUserStore.getState().chainId;
  return getChainFromId(chainId)?.tokenSymbol || 'RLC';
};

export const columns: ColumnDef<Deal>[] = [
  {
    accessorKey: 'dealid',
    header: 'Deal',
    cell: ({ row }) => {
      const dealId = row.original.dealid;
      return (
        <CopyButton
          displayText={truncateAddress(dealId, {
            startLen: 8,
          })}
          textToCopy={dealId}
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
    accessorKey: 'time',
    header: 'Time',
    cell: ({ row }) => {
      const timestamp = row.original.timestamp;
      return <div className="min-w-18">{formatElapsedTime(timestamp)}</div>;
    },
  },
  {
    accessorKey: 'success',
    header: 'Success',
    cell: ({ row }) => {
      return <SuccessCell deal={row.original} />;
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
      return (
        <span>
          {price} {getTokenSymbol()}
        </span>
      );
    },
  },
];
