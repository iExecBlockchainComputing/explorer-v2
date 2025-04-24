import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Box, Terminal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { execute } from "@/graphql/execute";
import { CircularLoader } from "@/components/CircularLoader";
import { dealsQuery } from "./dealsQuery";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatElapsedTime } from "@/utils/formatElapsedTime";
import { SuccessCell } from "./SuccessCell";
import { PREVIEW_TABLE_LENGTH } from "@/config";
import CopyButton from "@/components/CopyButton";
import { truncateAddress } from "@/utils/truncateAddress";

export function DealsPreviewTable() {
  const deals = useQuery({
    queryKey: ["deals_preview"],
    queryFn: () =>
      execute(dealsQuery, { length: PREVIEW_TABLE_LENGTH, skip: 0 }),
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans">
          <Box size="16" className="text-secondary" />
          Latest deals
        </h2>
        <Button variant="link" className="-mr-4">
          View all deals
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
          {deals.isLoading || deals.isError || !deals.data?.deals.length ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                {deals.isLoading ? (
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
                className="[&>td]:min-w-24 [&>td]:overflow-ellipsis [&>td]:overflow-hidden"
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
                <TableCell>{formatElapsedTime(deal.timestamp)}</TableCell>
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
                  })}{" "}
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
