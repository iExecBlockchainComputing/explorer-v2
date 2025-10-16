import { DETAIL_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { getIExec } from '@/externals/iexecSdkClient';
import { usePageParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/access/workerpoolColumns';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

function useWorkerpoolAccessData({
  workerpoolAddress,
  currentPage,
}: {
  workerpoolAddress: string;
  currentPage: number;
}) {
  const { chainId } = useUserStore();

  const queryKey = [
    chainId,
    'workerpool',
    'access',
    workerpoolAddress,
    currentPage,
  ];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: async () => {
        const iexec = await getIExec();

        const { count, orders } =
          await iexec.orderbook.fetchWorkerpoolOrderbook();

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

export function WorkerpoolAccessTable({
  workerpoolAddress,
  setLoading,
  setOutdated,
}: {
  workerpoolAddress: string;
  setLoading: (loading: boolean) => void;
  setOutdated: (outdated: boolean) => void;
}) {
  const [currentPage, setCurrentPage] = usePageParam('workerpoolAccessPage');
  const {
    data: access,
    isError,
    isLoading,
    isRefetching,
    additionalPages,
    hasPastError,
  } = useWorkerpoolAccessData({
    workerpoolAddress,
    currentPage: currentPage - 1,
  });

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
        <ErrorAlert message="A error occurred during workerpool access loading." />
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
