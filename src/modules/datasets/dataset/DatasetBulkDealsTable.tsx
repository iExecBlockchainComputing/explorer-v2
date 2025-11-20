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
import { datasetBulkDealsQuery } from './datasetBulkDealsQuery';

function useDatasetBulkDealsData({
  datasetId,
  currentPage,
}: {
  datasetId: string;
  currentPage: number;
}) {
  const { chainId } = useUserStore();
  const skip = currentPage * DETAIL_TABLE_LENGTH;
  const nextSkip = skip + DETAIL_TABLE_LENGTH;
  const nextNextSkip = skip + 2 * DETAIL_TABLE_LENGTH;

  const queryKey = [chainId, 'dataset', 'bulkDeals', datasetId, currentPage];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(datasetBulkDealsQuery, chainId, {
          length: DETAIL_TABLE_LENGTH,
          skip,
          nextSkip,
          nextNextSkip,
          datasetId,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  const bulkDeals = data?.bulkSliceice?.map((slice) => slice.task?.deal) ?? [];
  // 0 = only current, 1 = next, 2 = next+1
  const additionalPages = getAdditionalPages(
    Boolean(data?.bulkSliceiceHasNext?.length),
    Boolean(data?.bulkSliceiceHasNextNext?.length)
  );

  const formattedBulkDeal =
    bulkDeals
      ?.filter((bulkDeal) => bulkDeal !== undefined)
      .map((bulkDeal) => ({
        ...bulkDeal,
        destination: `/bulkDeal/${bulkDeal!.dealid}`,
      })) ?? [];

  return {
    data: formattedBulkDeal,
    isLoading,
    isRefetching,
    isError,
    additionalPages,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

export function DatasetBulkDealsTable({
  datasetId,
  setLoading,
  setOutdated,
}: {
  datasetId: string;
  setLoading: (loading: boolean) => void;
  setOutdated: (outdated: boolean) => void;
}) {
  const [currentPage, setCurrentPage] = usePageParam('datasetBulkDealsPage');
  const {
    data: bulkDeals,
    isError,
    isLoading,
    isRefetching,
    additionalPages,
    hasPastError,
  } = useDatasetBulkDealsData({ datasetId, currentPage: currentPage - 1 });

  useEffect(
    () => setLoading(isLoading || isRefetching),
    [isLoading, isRefetching, setLoading]
  );
  useEffect(
    () => setOutdated(bulkDeals.length > 0 && isError),
    [bulkDeals.length, isError, setOutdated]
  );

  return (
    <div className="space-y-6">
      {hasPastError && !bulkDeals.length ? (
        <ErrorAlert message="An error occurred during dataset bulkDeals loading." />
      ) : (
        <DataTable columns={columns} data={bulkDeals} />
      )}
      <PaginatedNavigation
        currentPage={currentPage}
        totalPages={currentPage + additionalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
