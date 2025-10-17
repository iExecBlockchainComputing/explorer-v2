import { PREVIEW_TABLE_LENGTH, PREVIEW_TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { ChainLink } from '@/components/ChainLink';
import { DataTable } from '@/components/DataTable';
import AppIcon from '@/components/icons/AppIcon';
import { Button } from '@/components/ui/button';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { ErrorAlert } from '../ErrorAlert';
import { appsQuery } from './appsQuery';
import { columns } from './appsTable/columns';

export function AppsPreviewTable({ className }: { className?: string }) {
  const { chainId } = useUserStore();

  const queryKey = [chainId, 'apps_preview'];
  const apps = useQuery({
    queryKey,
    queryFn: () =>
      execute(appsQuery, chainId, {
        length: PREVIEW_TABLE_LENGTH,
        skip: 0,
      }),
    refetchInterval: PREVIEW_TABLE_REFETCH_INTERVAL,
    enabled: !!chainId,
    placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
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
          <AppIcon size={20} className="text-foreground" />
          Latest apps deployed
          {apps.data && apps.isError && (
            <span className="text-muted-foreground text-sm font-light">
              (outdated)
            </span>
          )}
          {apps.isFetching && <LoaderCircle className="animate-spin" />}
        </h2>
        <Button variant="link" className="-mr-4" asChild>
          <ChainLink to="/apps">
            <span>
              View all <span className="content hidden sm:inline">apps</span>
            </span>
          </ChainLink>
        </Button>
      </div>
      {(apps.isError || apps.errorUpdateCount > 0) && !apps.data ? (
        <ErrorAlert message="An error occurred during apps loading." />
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
