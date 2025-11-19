import { PREVIEW_TABLE_LENGTH, PREVIEW_TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { Workerpool_OrderBy, OrderDirection } from '@/graphql/poco/graphql';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { ChainLink } from '@/components/ChainLink';
import { DataTable } from '@/components/DataTable';
import WorkerpoolIcon from '@/components/icons/WorkerpoolIcon';
import { Button } from '@/components/ui/button';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFn } from '@/utils/createPlaceholderDataFnForQueryKey';
import { getRecentFromTimestamp } from '@/utils/format';
import { ErrorAlert } from '../ErrorAlert';
import { workerpoolsQuery } from './workerpoolsQuery';
import { columns } from './workerpoolsTable/columns';

export function WorkerpoolsPreviewTable({ className }: { className?: string }) {
  const { chainId } = useUserStore();

  // Pertinent ordering: usageCount desc + recent usage constraint (last 14 days)
  const recentFrom = getRecentFromTimestamp();
  const orderBy: Workerpool_OrderBy = Workerpool_OrderBy.UsageCount;
  const orderDirection: OrderDirection = OrderDirection.Desc;
  const queryKey = [
    chainId,
    'workerpools_preview',
    orderBy,
    orderDirection,
    recentFrom,
  ];
  const workerpools = useQuery({
    queryKey,
    queryFn: () =>
      execute(workerpoolsQuery, chainId, {
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
    workerpools.data?.workerpools.map((workerpool) => ({
      ...workerpool,
      destination: `/workerpool/${workerpool.address}`,
    })) ?? [];

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans">
          <WorkerpoolIcon size={20} className="text-foreground" />
          Most pertinent workerpools
          {workerpools.data && workerpools.isError && (
            <span className="text-muted-foreground text-sm font-light">
              (outdated)
            </span>
          )}
          {workerpools.isFetching && <LoaderCircle className="animate-spin" />}
        </h2>
        <Button variant="link" className="-mr-4" asChild>
          <ChainLink to="/workerpools">
            <span>
              View all{' '}
              <span className="content hidden sm:inline">workerpools</span>
            </span>
          </ChainLink>
        </Button>
      </div>
      {(workerpools.isError || workerpools.errorUpdateCount > 0) &&
      !workerpools.data ? (
        <ErrorAlert message="An error occurred during workerpools loading." />
      ) : (
        <DataTable
          columns={columns}
          data={formattedData}
          tableLength={PREVIEW_TABLE_LENGTH}
          isLoading={workerpools.isLoading || workerpools.isRefetching}
        />
      )}
    </div>
  );
}
