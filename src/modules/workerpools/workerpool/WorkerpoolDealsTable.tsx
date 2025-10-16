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
import { getAdditionalPages } from '@/utils/format';
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
  const nextSkip = skip + DETAIL_TABLE_LENGTH;
  const nextNextSkip = skip + 2 * DETAIL_TABLE_LENGTH;

  const queryKey = [
    chainId,
    'workerpool',
    'deals',
    workerpoolAddress,
    currentPage,
  ];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(workerpoolDealsQuery, chainId, {
          length: DETAIL_TABLE_LENGTH,
          skip,
          nextSkip,
          nextNextSkip,
          workerpoolAddress,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  const deals = data?.workerpool?.deals ?? [];
  // 0 = only current, 1 = next, 2 = next+1
  const additionalPages = getAdditionalPages(
    Boolean(data?.workerpool?.dealsHasNext?.length),
    Boolean(data?.workerpool?.dealsHasNextNext?.length)
  );

  const formattedDeals =
    deals.map((deal) => ({
      ...deal,
      destination: `/deal/${deal.dealid}`,
    })) ?? [];

  return {
    data: formattedDeals,
    isLoading,
    isRefetching,
    isError,
    additionalPages,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

export function WorkerpoolDealsTable({
  workerpoolAddress,
  setLoading,
  setOutdated,
}: {
  workerpoolAddress: string;
  setLoading: (loading: boolean) => void;
  setOutdated: (outdated: boolean) => void;
}) {
  const [currentPage, setCurrentPage] = usePageParam('workerpoolDealsPage');
  const {
    data: deals,
    isError,
    isLoading,
    isRefetching,
    additionalPages,
    hasPastError,
  } = useWorkerpoolDealsData({
    workerpoolAddress,
    currentPage: currentPage - 1,
  });

  setLoading(isLoading || isRefetching);
  setOutdated(deals.length > 0 && isError);

  const filteredColumns = columns.filter(
    (col) => col.accessorKey !== 'dataset.address'
  );

  return (
    <div className="space-y-6">
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
        currentPage={currentPage}
        totalPages={currentPage + additionalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
