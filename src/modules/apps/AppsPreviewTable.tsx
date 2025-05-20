import { PREVIEW_TABLE_LENGTH, PREVIEW_TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Box, LoaderCircle, Terminal } from 'lucide-react';
import { CircularLoader } from '@/components/CircularLoader';
import { DataTable } from '@/components/DataTable';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { appsQuery } from './appsQuery';
import { columns } from './appsTable/columns';

export function AppsPreviewTable({ className }: { className?: string }) {
  const apps = useQuery({
    queryKey: ['apps_preview'],
    queryFn: () =>
      execute(appsQuery, { length: PREVIEW_TABLE_LENGTH, skip: 0 }),
    refetchInterval: PREVIEW_TABLE_REFETCH_INTERVAL,
  });

  const formattedData =
    apps.data?.apps.map((app) => ({
      ...app,
      destination: `/app/${app.address}`,
    })) ?? [];

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
          {apps.isFetching && <LoaderCircle className="animate-spin" />}
        </h2>
        <Button variant="link" className="-mr-4" asChild>
          <Link to="/apps">View all</Link>
        </Button>
      </div>
      {(apps.isError || apps.errorUpdateCount > 0) && !apps.data ? (
        <Alert variant="destructive" className="mx-auto w-fit text-left">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            A error occurred during apps loading.
          </AlertDescription>
        </Alert>
      ) : (
        <DataTable
          columns={columns}
          data={formattedData}
          tableLength={PREVIEW_TABLE_LENGTH}
          isLoading={apps.isLoading || apps.isRefetching}
        />
      )}
    </div>
  );
}
