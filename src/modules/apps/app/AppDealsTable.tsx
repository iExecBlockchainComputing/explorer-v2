import { DETAIL_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/deals/dealsTable/columns';
import useUserStore from '@/stores/useUser.store';
import { appDealsQuery } from './appDealsQuery';
import { nextAppDealsQuery } from './nextAppDealsQuery';

function useAppDealsData({
  appAddress,
  currentPage,
}: {
  appAddress: string;
  currentPage: number;
}) {
  const { chainId } = useUserStore();
  const skip = currentPage * DETAIL_TABLE_LENGTH;

  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey: ['app', 'deals', appAddress],
      queryFn: () =>
        execute(appDealsQuery, chainId, {
          length: DETAIL_TABLE_LENGTH,
          skip,
          appAddress,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
    }
  );

  const { data: nextData } = useQuery({
    queryKey: [chainId, 'deals-next', currentPage],
    queryFn: () =>
      execute(nextAppDealsQuery, chainId, {
        length: DETAIL_TABLE_LENGTH * 2,
        skip: (currentPage + 1) * DETAIL_TABLE_LENGTH,
        appAddress,
      }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
  });

  const nextDeals = nextData?.app?.deals ?? [];

  const additionalPages = Math.ceil(nextDeals.length / DETAIL_TABLE_LENGTH);

  const formattedDeal =
    data?.app?.deals.map((deal) => ({
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
  const [currentPage, setCurrentPage] = useState(0);
  const {
    data: deals,
    isError,
    isLoading,
    isRefetching,
    additionalPages,
    hasPastError,
  } = useAppDealsData({ appAddress, currentPage });

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
        currentPage={currentPage + 1}
        totalPages={currentPage + 1 + additionalPages}
        onPageChange={(newPage) => setCurrentPage(newPage - 1)}
      />
    </div>
  );
}
