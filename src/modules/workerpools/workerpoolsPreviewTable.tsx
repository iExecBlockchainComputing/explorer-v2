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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PREVIEW_TABLE_LENGTH } from "@/config";
import CopyButton from "@/components/CopyButton";
import { truncateAddress } from "@/utils/truncateAddress";
import { workerpoolsQuery } from "./workerpoolsQuery";
import { formatElapsedTime } from "@/utils/formatElapsedTime";

export function WorkerpoolsPreviewTable() {
  const workerpools = useQuery({
    queryKey: ["workerpools_preview"],
    queryFn: () =>
      execute(workerpoolsQuery, { length: PREVIEW_TABLE_LENGTH, skip: 0 }),
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans">
          <Box size="16" className="text-secondary" />
          Latest workerpools deployed
        </h2>
        <Button variant="link">View all deployed workerpools</Button>
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
          {workerpools.isLoading ||
          workerpools.isError ||
          !workerpools.data?.workerpools.length ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                {workerpools.isLoading ? (
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
                className="[&>td]:min-w-24 [&>td]:overflow-ellipsis [&>td]:overflow-hidden"
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
                <TableCell>{formatElapsedTime(workerpool.timestamp)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
