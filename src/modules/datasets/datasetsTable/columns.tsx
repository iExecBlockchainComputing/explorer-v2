import { DatasetsQuery } from '@/graphql/poco/graphql';
import { ColumnDef } from '@tanstack/react-table';
import CopyButton from '@/components/CopyButton';
import { formatElapsedTime } from '@/utils/formatElapsedTime';
import { truncateAddress } from '@/utils/truncateAddress';
import TypeBadge from '../dataset/schema/TypeBadge';

type Dataset = DatasetsQuery['datasets'][number] & {
  schema?: Array<{ path?: string | null; type?: string | null }>;
  isSchemasLoading?: boolean;
};
export const columns: ColumnDef<Dataset>[] = [
  {
    accessorKey: 'datasetAddress',
    header: 'Dataset',
    cell: ({ row }) => {
      const datasetAddress = row.original.address;
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
    accessorKey: 'datasetName',
    header: 'Name',
    cell: ({ row }) => {
      const datasetName = row.original.name;
      return datasetName ? (
        <div className="w-36">
          <CopyButton
            displayText={datasetName}
            textToCopy={datasetName}
            tooltipWithText
          />
        </div>
      ) : (
        <span className="text-muted-foreground">No name</span>
      );
    },
  },
  {
    accessorKey: 'datasetSchema',
    header: 'Type',
    cell: ({ row }) => {
      const datasetSchema = row.original.schema;
      const isSchemasLoading = row.original.isSchemasLoading;
      return (
        <TypeBadge isLoading={isSchemasLoading} schemaPaths={datasetSchema} />
      );
    },
  },
  {
    accessorKey: 'owner.address',
    header: 'Owner',
    cell: ({ row }) => {
      const ownerAddress = row.original.owner.address;
      return (
        <CopyButton
          displayText={truncateAddress(ownerAddress, {
            startLen: 8,
          })}
          textToCopy={ownerAddress}
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
    accessorKey: 'tx_hash',
    header: 'TxHash',
    cell: ({ row }) => {
      const txHash = row.original.transfers[0].transaction.txHash;
      return (
        <CopyButton
          displayText={truncateAddress(txHash, {
            startLen: 8,
          })}
          textToCopy={txHash}
        />
      );
    },
  },
];
