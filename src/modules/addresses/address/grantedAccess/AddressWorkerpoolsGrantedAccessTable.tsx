import { PREVIEW_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { getIExec } from '@/externals/iexecSdkClient';
import { usePageParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { columns } from './addressWorkerpoolColumns';

function useAddressWorkerpoolsGrantedAccessData({
  addressAddress,
  currentPage,
}: {
  addressAddress: string;
  currentPage: number;
}) {
  const { chainId } = useUserStore();

  const pageSize = PREVIEW_TABLE_LENGTH * 2;

  // API returns min 10 items, but we display only 5 per page
  const apiBatch = Math.floor((currentPage * PREVIEW_TABLE_LENGTH) / pageSize);
  const startIndexInBatch = (currentPage * PREVIEW_TABLE_LENGTH) % pageSize;

  const queryKey = [
    chainId,
    'address',
    'workerpoolsGrantedAccess',
    addressAddress,
    apiBatch,
  ];

  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: async () => {
        const iexec = await getIExec();

        const { count, orders } =
          await iexec.orderbook.fetchWorkerpoolOrderbook({
            dataset: 'any',
            app: 'any',
            workerpool: 'any',
            requester: 'any',
            workerpoolOwner: addressAddress,
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
    startIndexInBatch + PREVIEW_TABLE_LENGTH
  );
  const formattedAccess =
    access.map((access) => ({
      ...access,
      destination: `/access/workerpool/${access.orderHash.toLowerCase()}`,
    })) ?? [];
  const count = data?.count || 0;

  return {
    data: formattedAccess,
    totalCount: count,
    isLoading,
    isRefetching,
    isError,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

export function AddressWorkerpoolsGrantedAccessTable({
  addressAddress,
}: {
  addressAddress: string;
}) {
  const [currentPage, setCurrentPage] = usePageParam(
    'addressWorkerpoolsGrantedAccessPage'
  );
  const {
    data: access,
    totalCount,
    isError,
    isLoading,
    isRefetching,
    hasPastError,
  } = useAddressWorkerpoolsGrantedAccessData({
    addressAddress,
    currentPage: currentPage - 1,
  });

  const { address: userAddress } = useUserStore();
  const filteredColumns =
    userAddress === addressAddress
      ? columns
      : columns.filter((c) => c.accessorKey !== 'revokeAccess');

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 font-extrabold">
        Latest workerpools access
        {!access && isError && (
          <span className="text-muted-foreground text-sm font-light">
            (outdated)
          </span>
        )}
        {(isLoading || isRefetching) && (
          <LoaderCircle className="animate-spin" />
        )}
      </h2>
      {hasPastError && !access.length ? (
        <ErrorAlert message="An error occurred during address workerpools access loading." />
      ) : (
        <DataTable
          columns={filteredColumns}
          data={access}
          tableLength={PREVIEW_TABLE_LENGTH}
        />
      )}
      <PaginatedNavigation
        currentPage={currentPage}
        totalPages={Math.ceil(totalCount / PREVIEW_TABLE_LENGTH)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
