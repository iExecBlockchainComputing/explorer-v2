import { DETAIL_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { getIExec } from '@/externals/iexecSdkClient';
import { usePageParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/access/appColumns';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

function useAppAccessData({
  appAddress,
  currentPage,
}: {
  appAddress: string;
  currentPage: number;
}) {
  const { chainId } = useUserStore();

  const pageSize = DETAIL_TABLE_LENGTH * 2;

  // API returns min 10 items, but we display only 5 per page
  const apiBatch = Math.floor((currentPage * DETAIL_TABLE_LENGTH) / pageSize);
  const startIndexInBatch = (currentPage * DETAIL_TABLE_LENGTH) % pageSize;

  const queryKey = [chainId, 'app', 'access', appAddress, currentPage];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: async () => {
        const iexec = await getIExec();

        const { count, orders } = await iexec.orderbook.fetchAppOrderbook({
          app: appAddress,
          page: apiBatch,
          pageSize,
        });
        return { count, orders };
      },
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );
  const allOrders = data?.orders || [];
  const access = allOrders.slice(
    startIndexInBatch,
    startIndexInBatch + DETAIL_TABLE_LENGTH
  );
  const count = data?.count || 0;

  return {
    data: access,
    totalCount: count,
    isLoading,
    isRefetching,
    isError,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

export function AppAccessTable({
  appAddress,
  setLoading,
  setOutdated,
}: {
  appAddress: string;
  setLoading: (loading: boolean) => void;
  setOutdated: (outdated: boolean) => void;
}) {
  const [currentPage, setCurrentPage] = usePageParam('appAccessPage');
  const {
    data: access,
    totalCount,
    isError,
    isLoading,
    isRefetching,
    hasPastError,
  } = useAppAccessData({ appAddress, currentPage: currentPage - 1 });

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
        <ErrorAlert message="A error occurred during app access loading." />
      ) : (
        <DataTable
          columns={columns}
          data={access}
          tableLength={DETAIL_TABLE_LENGTH}
        />
      )}
      <PaginatedNavigation
        currentPage={currentPage}
        totalPages={Math.ceil(totalCount / DETAIL_TABLE_LENGTH)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
