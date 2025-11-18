import { DETAIL_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { usePageParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/deals/dealsTable/columns';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { getAdditionalPages } from '@/utils/format';
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
  const nextNextSkip = skip + 2 * DETAIL_TABLE_LENGTH;

  const queryKey = [chainId, 'deal', 'associatedDeals', dealId, currentPage];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(dealAssociatedDealsQuery, chainId, {
          length: DETAIL_TABLE_LENGTH,
          skip,
          nextSkip,
          nextNextSkip,
          dealId,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );
  const associatedDeals = data?.deal?.requestorder?.deals ?? [];
  const additionalPages = getAdditionalPages(
    Boolean(data?.deal?.requestorder?.dealsHasNext?.length),
    Boolean(data?.deal?.requestorder?.dealsHasNextNext?.length)
  );

  const formattedAssociatedDeal = associatedDeals.map((associatedDeal) => ({
    ...associatedDeal,
    destination: `/deal/${associatedDeal.dealid}`,
  }));

  return {
    data: formattedAssociatedDeal,
    isLoading,
    isRefetching,
    isError,
    additionalPages,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

export function DealAssociatedDealsTable({
  dealId,
  setLoading,
  setOutdated,
}: {
  dealId: string;
  setLoading: (isLoading: boolean) => void;
  setOutdated: (isOutdated: boolean) => void;
}) {
  const [currentPage, setCurrentPage] = usePageParam('dealAssociatedDealsPage');
  const {
    data: associatedDeals,
    isError,
    isLoading,
    isRefetching,
    additionalPages,
    hasPastError,
  } = useDealAssociatedDealsData({
    dealId,
    currentPage: currentPage - 1,
  });

  useEffect(
    () => setLoading(isLoading || isRefetching),
    [isLoading, isRefetching, setLoading]
  );
  useEffect(
    () => setOutdated(associatedDeals.length > 0 && isError),
    [associatedDeals.length, isError, setOutdated]
  );

  return (
    <div className="space-y-6">
      {hasPastError && !associatedDeals.length ? (
        <ErrorAlert message="An error occurred during associated deals loading." />
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
