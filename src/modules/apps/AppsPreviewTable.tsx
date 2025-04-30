import { PREVIEW_TABLE_LENGTH, PREVIEW_TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
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
import { appsQuery } from './appsQuery';

export function AppsPreviewTable({ className }: { className?: string }) {
  const apps = useQuery({
    queryKey: ['apps_preview'],
    queryFn: () =>
      execute(appsQuery, { length: PREVIEW_TABLE_LENGTH, skip: 0 }),
    refetchInterval: PREVIEW_TABLE_REFETCH_INTERVAL,
  });

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans">
          <Box size="16" className="text-secondary" />
          Latest apps deployed
          {apps.data && apps.isError && (
            <span className="text-muted-foreground text-sm font-light">
              (outdated)
            </span>
          )}
          {apps.isFetching && !apps.isPending && (
            <LoaderCircle className="animate-spin" />
          )}
        </h2>
        <Button variant="link" className="-mr-4" asChild>
          <Link to="/apps">View all</Link>
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
          {apps.isPending ||
          (apps.isError && !apps.data) ||
          !apps.data?.apps.length ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center">
                {apps.isPending ? (
                  <CircularLoader />
                ) : apps.isError ? (
                  <Alert
                    variant="destructive"
                    className="mx-auto w-fit text-left"
                  >
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      A error occurred during apps loading.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <p>No apps to display.</p>
                )}
              </TableCell>
            </TableRow>
          ) : (
            apps.data.apps.map((app) => (
              <TableRow
                key={app.address}
                className="[&>td]:min-w-24 [&>td]:overflow-hidden [&>td]:overflow-ellipsis"
              >
                <TableCell>
                  <CopyButton
                    displayText={truncateAddress(app.address, {
                      startLen: 8,
                    })}
                    textToCopy={app.address}
                  />
                </TableCell>
                <TableCell>
                  <CopyButton displayText={app.name} textToCopy={app.name} />
                </TableCell>
                <TableCell>
                  <CopyButton
                    displayText={truncateAddress(app.owner.address, {
                      startLen: 8,
                    })}
                    textToCopy={app.owner.address}
                  />
                </TableCell>
                <TableCell>
                  <CopyButton
                    displayText={truncateAddress(
                      app.transfers[0].transaction.txHash,
                      {
                        startLen: 8,
                      }
                    )}
                    textToCopy={app.transfers[0].transaction.txHash}
                  />
                </TableCell>
                <TableCell className="min-w-42!">
                  {formatElapsedTime(app.timestamp)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
