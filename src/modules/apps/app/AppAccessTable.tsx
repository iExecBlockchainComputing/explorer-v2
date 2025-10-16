import { DETAIL_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
// import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { getIExec } from '@/externals/iexecSdkClient';
import { usePageParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/access/columns';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

// import { appAccessQuery } from './appAccessQuery';

function useAppAccessData({
  appAddress,
  currentPage,
}: {
  appAddress: string;
  currentPage: number;
}) {
  const { chainId } = useUserStore();

  const queryKey = [chainId, 'app', 'access', appAddress, currentPage];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: async () => {
        const iexec = await getIExec();

        const { count, orders } =
          await iexec.orderbook.fetchAppOrderbook(appAddress);
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

export function AppAccessTable({ appAddress }: { appAddress: string }) {
  const [currentPage, setCurrentPage] = usePageParam('appAccessPage');
  const {
    data: access,
    isError,
    isLoading,
    isRefetching,
    additionalPages,
    hasPastError,
  } = useAppAccessData({ appAddress, currentPage: currentPage - 1 });

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
        totalPages={currentPage + additionalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
