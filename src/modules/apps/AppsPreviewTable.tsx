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
import { appsQuery } from "./appsQuery";
import { formatElapsedTime } from "@/utils/formatElapsedTime";

export function AppsPreviewTable() {
  const apps = useQuery({
    queryKey: ["apps_preview"],
    queryFn: () =>
      execute(appsQuery, { length: PREVIEW_TABLE_LENGTH, skip: 0 }),
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans">
          <Box size="16" className="text-secondary" />
          Latest apps deployed
        </h2>
        <Button variant="link" className="-mr-4">
          View all deployed apps
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
          {apps.isLoading || apps.isError || !apps.data?.apps.length ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                {apps.isLoading ? (
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
                className="[&>td]:min-w-24 [&>td]:overflow-ellipsis [&>td]:overflow-hidden"
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
                      },
                    )}
                    textToCopy={app.transfers[0].transaction.txHash}
                  />
                </TableCell>
                <TableCell>{formatElapsedTime(app.timestamp)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
