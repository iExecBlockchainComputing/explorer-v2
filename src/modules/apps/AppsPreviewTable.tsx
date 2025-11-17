import { PREVIEW_TABLE_LENGTH, PREVIEW_TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { App_OrderBy, OrderDirection } from '@/graphql/poco/graphql';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { ChainLink } from '@/components/ChainLink';
import { DataTable } from '@/components/DataTable';
import AppIcon from '@/components/icons/AppIcon';
import { Button } from '@/components/ui/button';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFn } from '@/utils/createPlaceholderDataFnForQueryKey';
import { ErrorAlert } from '../ErrorAlert';
import { appsQuery } from './appsQuery';
import { columns } from './appsTable/columns';

export function AppsPreviewTable({ className }: { className?: string }) {
  const { chainId } = useUserStore();

  // Pertinent ordering: usageCount desc + recent usage constraint (last 14 days)
  const recentFrom = Math.floor(Date.now() / 1000) - 14 * 24 * 60 * 60;
  const orderBy: App_OrderBy = App_OrderBy.UsageCount;
  const orderDirection: OrderDirection = OrderDirection.Desc;
  const queryKey = [
    chainId,
    'apps_preview',
    orderBy,
    orderDirection,
    recentFrom,
  ];
  const apps = useQuery({
    queryKey,
    queryFn: () =>
      execute(appsQuery, chainId, {
        length: PREVIEW_TABLE_LENGTH,
        skip: 0,
        orderBy,
        orderDirection,
        recentFrom,
      }),
    refetchInterval: PREVIEW_TABLE_REFETCH_INTERVAL,
    enabled: !!chainId,
    placeholderData: createPlaceholderDataFn(),
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
          Most pertinent apps
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
