import { DETAIL_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { usePageParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/deals/dealsTable/columns';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { dealAssociatedDealsQuery } from './dealAssociatedDealsQuery';

function useDealAssociatedDealsData({
  dealId,
  currentPage,
}: {
  dealId: string;
  currentPage: number;
}) {
  const { chainId } = useUserStore();
  const skip = currentPage * DETAIL_TABLE_LENGTH;
  const nextSkip = skip + DETAIL_TABLE_LENGTH;

  const queryKey = [chainId, 'deal', 'associatedDeals', dealId, currentPage];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(dealAssociatedDealsQuery, chainId, {
          length: DETAIL_TABLE_LENGTH,
          skip,
          nextSkip,
          dealId,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );
  const associatedDeals = data?.deal?.requestorder?.deals ?? [];
  const hasNextPage = (associatedDeals.dealsHasNext?.length ?? 0) > 0;
  const additionalPages = hasNextPage ? 1 : 0;

  const formattedAssociatedDeal =
    associatedDeals.map((associatedDeal) => ({
      ...associatedDeal,
      destination: `/deal/${associatedDeal.dealid}`,
    })) ?? [];

  return {
    data: formattedAssociatedDeal,
    isLoading,
    isRefetching,
    isError,
    additionalPages,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

export function DealAssociatedDealsTable({ dealId }: { dealId: string }) {
  const [currentPage, setCurrentPage] = usePageParam('dealAssociatedDealsPage');
  const {
    data: associatedDeals,
    additionalPages,
    hasPastError,
  } = useDealAssociatedDealsData({
    dealId,
    currentPage,
  });

  return (
    <div className="space-y-6">
      {hasPastError && !associatedDeals.length ? (
        <ErrorAlert message="An error occurred during deal associatedDeals loading." />
      ) : (
        <DataTable columns={columns} data={associatedDeals} />
      )}
      <PaginatedNavigation
        currentPage={currentPage}
        totalPages={currentPage + additionalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
