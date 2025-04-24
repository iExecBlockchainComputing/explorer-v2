import { PREVIEW_TABLE_LENGTH, PREVIEW_TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { Box, LoaderCircle, Terminal } from 'lucide-react';
import { CircularLoader } from '@/components/CircularLoader';
import CopyButton from '@/components/CopyButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatElapsedTime } from '@/utils/formatElapsedTime';
import { truncateAddress } from '@/utils/truncateAddress';
import { datasetsQuery } from './datasetsQuery';

export function DatasetsPreviewTable() {
  const datasets = useQuery({
    queryKey: ['datasets_preview'],
    queryFn: () =>
      execute(datasetsQuery, { length: PREVIEW_TABLE_LENGTH, skip: 0 }),
    refetchInterval: PREVIEW_TABLE_REFETCH_INTERVAL,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans">
          <Box size="16" className="text-secondary" />
          Latest datasets deployed
          {datasets.isFetching && !datasets.isPending && (
            <LoaderCircle className="animate-spin" />
          )}
        </h2>
        <Button variant="link" className="-mr-4">
          View all
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>TxHash</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datasets.isPending ||
          datasets.isError ||
          !datasets.data?.datasets.length ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center">
                {datasets.isPending ? (
                  <CircularLoader />
                ) : datasets.isError ? (
                  <Alert
                    variant="destructive"
                    className="mx-auto w-fit text-left"
                  >
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      A error occurred during datasets loading.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <p>No datasets to display.</p>
                )}
              </TableCell>
            </TableRow>
          ) : (
            datasets.data.datasets.map((dataset) => (
              <TableRow
                key={dataset.address}
                className="[&>td]:min-w-24 [&>td]:overflow-hidden [&>td]:overflow-ellipsis"
              >
                <TableCell>
                  <CopyButton
                    displayText={truncateAddress(dataset.address, {
                      startLen: 8,
                    })}
                    textToCopy={dataset.address}
                  />
                </TableCell>
                <TableCell>
                  <CopyButton
                    displayText={dataset.name}
                    textToCopy={dataset.name}
                  />
                </TableCell>
                <TableCell>
                  <CopyButton
                    displayText={truncateAddress(dataset.owner.address, {
                      startLen: 8,
                    })}
                    textToCopy={dataset.owner.address}
                  />
                </TableCell>
                <TableCell>
                  <CopyButton
                    displayText={truncateAddress(
                      dataset.transfers[0].transaction.txHash,
                      {
                        startLen: 8,
                      }
                    )}
                    textToCopy={dataset.transfers[0].transaction.txHash}
                  />
                </TableCell>
                <TableCell>{formatElapsedTime(dataset.timestamp)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
