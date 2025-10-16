import { DETAIL_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { getIExec } from '@/externals/iexecSdkClient';
import { usePageParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/access/datasetColumns';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

function useDatasetAccessData({
  datasetAddress,
  currentPage,
}: {
  datasetAddress: string;
  currentPage: number;
}) {
  const { chainId } = useUserStore();

  const queryKey = [chainId, 'dataset', 'access', datasetAddress, currentPage];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: async () => {
        const iexec = await getIExec();

        const { count, orders } =
          await iexec.orderbook.fetchDatasetOrderbook(datasetAddress);
        return { count, orders };
      },
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  const access = data?.orders || [];
  const count = data?.count || 0;
  const hasNextPage = count > DETAIL_TABLE_LENGTH;
  const additionalPages = hasNextPage
    ? Math.ceil(count / DETAIL_TABLE_LENGTH) - 1
    : 0;

  return {
    data: access,
    isLoading,
    isRefetching,
    isError,
    additionalPages,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

export function DatasetAccessTable({
  datasetAddress,
  setLoading,
  setOutdated,
}: {
  datasetAddress: string;
  setLoading: (loading: boolean) => void;
  setOutdated: (outdated: boolean) => void;
}) {
  const [currentPage, setCurrentPage] = usePageParam('datasetAccessPage');
  const {
    data: access,
    isError,
    isLoading,
    isRefetching,
    additionalPages,
    hasPastError,
  } = useDatasetAccessData({ datasetAddress, currentPage: currentPage - 1 });

  useEffect(
    () => setLoading(isLoading || isRefetching),
    [isLoading, isRefetching, setLoading]
  );
  useEffect(
    () => setOutdated(access.length > 0 && isError),
    [access.length, isError, setOutdated]
  );

  return (
    <div className="space-y-6">
      {hasPastError && !access.length ? (
        <ErrorAlert message="A error occurred during dataset access loading." />
      ) : (
        <DataTable
          columns={columns}
          data={access}
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
