import { DETAIL_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { usePageParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/deals/dealsTable/columns';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { appDealsQuery } from './appDealsQuery';

function useAppDealsData({
  appAddress,
  currentPage,
}: {
  appAddress: string;
  currentPage: number;
}) {
  const { chainId } = useUserStore();
  const skip = currentPage * DETAIL_TABLE_LENGTH;
  const nextSkip = skip + DETAIL_TABLE_LENGTH;

  const queryKey = [chainId, 'app', 'deals', appAddress, currentPage];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(appDealsQuery, chainId, {
          length: DETAIL_TABLE_LENGTH,
          skip,
          nextSkip,
          appAddress,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  const deals = data?.app?.deals ?? [];
  const hasNextPage = (data?.app?.dealsHasNext?.length ?? 0) > 0;
  const additionalPages = hasNextPage ? 1 : 0;

  const formattedDeal =
    deals.map((deal) => ({
      ...deal,
      destination: `/deal/${deal.dealid}`,
    })) ?? [];

  return {
    data: formattedDeal,
    isLoading,
    isRefetching,
    isError,
    additionalPages,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

export function AppDealsTable({ appAddress }: { appAddress: string }) {
  const [currentPage, setCurrentPage] = usePageParam('appDealsPage');
  const {
    data: deals,
    isError,
    isLoading,
    isRefetching,
    additionalPages,
    hasPastError,
  } = useAppDealsData({ appAddress, currentPage: currentPage - 1 });

  const filteredColumns = columns.filter((col) => col.accessorKey !== 'app');

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 font-extrabold">
        Latests deals
        {!deals && isError && (
          <span className="text-muted-foreground text-sm font-light">
            (outdated)
          </span>
        )}
        {(isLoading || isRefetching) && (
          <LoaderCircle className="animate-spin" />
        )}
      </h2>
      {hasPastError && !deals.length ? (
        <ErrorAlert message="A error occurred during app deals loading." />
      ) : (
        <DataTable
          columns={filteredColumns}
          data={deals}
          tableLength={DETAIL_TABLE_LENGTH}
        />
      )}
      <PaginatedNavigation
        currentPage={currentPage}
        totalPages={currentPage + additionalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
