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
import { nextWorkerpoolDealsQuery } from './nextWorkerpoolDealsQuery';
import { workerpoolDealsQuery } from './workerpoolDealsQuery';

function useWorkerpoolDealsData({
  workerpoolAddress,
  currentPage,
}: {
  workerpoolAddress: string;
  currentPage: number;
}) {
  const { chainId } = useUserStore();
  const skip = currentPage * DETAIL_TABLE_LENGTH;

  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey: [chainId, 'workerpool', 'deals', workerpoolAddress],
      queryFn: () =>
        execute(workerpoolDealsQuery, chainId, {
          length: DETAIL_TABLE_LENGTH,
          skip,
          workerpoolAddress,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
    }
  );

  const { data: nextData } = useQuery({
    queryKey: [chainId, 'workerpool', 'deals-next', currentPage],
    queryFn: () =>
      execute(nextWorkerpoolDealsQuery, chainId, {
        length: DETAIL_TABLE_LENGTH * 2,
        skip: (currentPage + 1) * DETAIL_TABLE_LENGTH,
        workerpoolAddress,
      }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
  });

  const nextDeals = nextData?.workerpool?.deals ?? [];

  const additionalPages = Math.ceil(nextDeals.length / DETAIL_TABLE_LENGTH);

  const formattedDeal =
    data?.workerpool?.deals.map((deal) => ({
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

export function WorkerpoolDealsTable({
  workerpoolAddress,
}: {
  workerpoolAddress: string;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const {
    data: deals,
    isError,
    isLoading,
    isRefetching,
    additionalPages,
    hasPastError,
  } = useWorkerpoolDealsData({ workerpoolAddress, currentPage });

  const filteredColumns = columns.filter(
    (col) => col.accessorKey !== 'dataset.address'
  );

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
        <ErrorAlert message="A error occurred during workerpool deals loading." />
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
