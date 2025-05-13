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
import { formatElapsedTime } from '@/utils/formatElapsedTime';
import { truncateAddress } from '@/utils/truncateAddress';
import { SuccessCell } from './SuccessCell';
import { dealsQuery } from './dealsQuery';

export function DealsPreviewTable({ className }: { className?: string }) {
  const deals = useQuery({
    queryKey: ['deals_preview'],
    queryFn: () =>
      execute(dealsQuery, { length: PREVIEW_TABLE_LENGTH, skip: 0 }),
    refetchInterval: PREVIEW_TABLE_REFETCH_INTERVAL,
  });

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans">
          <Box size="16" className="text-secondary" />
          Latest deals
          {deals.data && deals.isError && (
            <span className="text-muted-foreground text-sm font-light">
              (outdated)
            </span>
          )}
          {deals.isFetching && !deals.isPending && (
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
            <TableHead>Deal</TableHead>
            <TableHead>App</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Workerpool</TableHead>
            <TableHead>Dataset</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Success</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.isPending ||
          (deals.isError && !deals.data) ||
          !deals.data?.deals.length ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center">
                {deals.isPending ? (
                  <CircularLoader />
                ) : deals.isError ? (
                  <Alert
                    variant="destructive"
                    className="mx-auto w-fit text-left"
                  >
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      A error occurred during deals loading.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <p>No deals to display.</p>
                )}
              </TableCell>
            </TableRow>
          ) : (
            deals.data.deals.map((deal) => (
              <TableRow
                key={deal.dealid}
                className="[&>td]:min-w-24 [&>td]:overflow-hidden [&>td]:overflow-ellipsis"
              >
                <TableCell>
                  <CopyButton
                    displayText={truncateAddress(deal.dealid, {
                      startLen: 8,
                    })}
                    textToCopy={deal.dealid}
                  />
                </TableCell>
                <TableCell>
                  <CopyButton
                    displayText={truncateAddress(deal.app?.address, {
                      startLen: 8,
                    })}
                    textToCopy={deal.app?.address}
                  />
                </TableCell>
                <TableCell className="min-w-42!">
                  {formatElapsedTime(deal.timestamp)}
                </TableCell>
                <TableCell>
                  <CopyButton
                    displayText={truncateAddress(deal.workerpool?.address, {
                      startLen: 8,
                    })}
                    textToCopy={deal.workerpool?.address}
                  />
                </TableCell>
                <TableCell>
                  {deal.dataset?.address ? (
                    <CopyButton
                      displayText={truncateAddress(deal.dataset?.address, {
                        startLen: 8,
                      })}
                      textToCopy={deal.dataset?.address}
                    />
                  ) : (
                    <span className="text-muted-foreground">
                      No dataset address
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {(
                    Number(deal.appPrice) +
                    Number(deal.datasetPrice) +
                    Number(deal.workerpoolPrice)
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 10,
                  })}{' '}
                  xRLC
                </TableCell>
                <TableCell>
                  <SuccessCell deal={deal} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
