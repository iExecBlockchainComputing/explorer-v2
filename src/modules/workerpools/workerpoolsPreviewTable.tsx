import { PREVIEW_TABLE_LENGTH, PREVIEW_TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { cn } from '@/lib/utils';
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
import useUserStore from '@/stores/useUser.store';
import { formatElapsedTime } from '@/utils/formatElapsedTime';
import { truncateAddress } from '@/utils/truncateAddress';
import { workerpoolsQuery } from './workerpoolsQuery';

export function WorkerpoolsPreviewTable({ className }: { className?: string }) {
  const { subgraphUrl } = useUserStore();
  const workerpools = useQuery({
    queryKey: ['workerpools_preview'],
    queryFn: () =>
      execute(workerpoolsQuery, subgraphUrl, {
        length: PREVIEW_TABLE_LENGTH,
        skip: 0,
      }),
    refetchInterval: PREVIEW_TABLE_REFETCH_INTERVAL,
  });

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans">
          <Box size="16" className="text-secondary" />
          Latest workerpools deployed
          {workerpools.data && workerpools.isError && (
            <span className="text-muted-foreground text-sm font-light">
              (outdated)
            </span>
          )}
          {workerpools.isFetching && !workerpools.isPending && (
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
            <TableHead>Description</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>TxHash</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workerpools.isPending ||
          (workerpools.isError && !workerpools.data) ||
          !workerpools.data?.workerpools.length ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center">
                {workerpools.isPending ? (
                  <CircularLoader />
                ) : workerpools.isError ? (
                  <Alert
                    variant="destructive"
                    className="mx-auto w-fit text-left"
                  >
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      A error occurred during workerpools loading.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <p>No workerpools to display.</p>
                )}
              </TableCell>
            </TableRow>
          ) : (
            workerpools.data.workerpools.map((workerpool) => (
              <TableRow
                key={workerpool.address}
                className="[&>td]:min-w-24 [&>td]:overflow-hidden [&>td]:overflow-ellipsis"
              >
                <TableCell>
                  <CopyButton
                    displayText={truncateAddress(workerpool.address, {
                      startLen: 8,
                    })}
                    textToCopy={workerpool.address}
                  />
                </TableCell>
                <TableCell>
                  <CopyButton
                    displayText={workerpool.description}
                    textToCopy={workerpool.description}
                  />
                </TableCell>
                <TableCell>
                  <CopyButton
                    displayText={truncateAddress(workerpool.owner.address, {
                      startLen: 8,
                    })}
                    textToCopy={workerpool.owner.address}
                  />
                </TableCell>
                <TableCell>
                  <CopyButton
                    displayText={truncateAddress(
                      workerpool.transfers[0].transaction.txHash,
                      {
                        startLen: 8,
                      }
                    )}
                    textToCopy={workerpool.transfers[0].transaction.txHash}
                  />
                </TableCell>
                <TableCell className="min-w-42!">
                  {formatElapsedTime(workerpool.timestamp)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
