import { PREVIEW_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { usePageParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/workerpools/workerpoolsTable/columns';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { getAdditionalPages } from '@/utils/format';
import { addressWorkerpoolsQuery } from './addressWorkerpoolsQuery';

function useAddressWorkerpoolsData({
  addressAddress,
  currentPage,
}: {
  addressAddress: string;
  currentPage: number;
}) {
  const { chainId } = useUserStore();
  const skip = currentPage * PREVIEW_TABLE_LENGTH;
  const nextSkip = skip + PREVIEW_TABLE_LENGTH;
  const nextNextSkip = skip + 2 * PREVIEW_TABLE_LENGTH;

  const queryKey = [
    chainId,
    'address',
    'workerpools',
    addressAddress,
    currentPage,
  ];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(addressWorkerpoolsQuery, chainId, {
          length: PREVIEW_TABLE_LENGTH,
          skip,
          nextSkip,
          nextNextSkip,
          address: addressAddress,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  const workerpools = data?.account?.workerpools ?? [];
  // 0 = only current, 1 = next, 2 = next+1
  const additionalPages = getAdditionalPages(
    Boolean(data?.account?.workerpoolsHasNext?.length),
    Boolean(data?.account?.workerpoolsHasNextNext?.length)
  );

  const formattedWorkerpools =
    workerpools.map((workerpool) => ({
      ...workerpool,
      destination: `/workerpool/${workerpool.address}`,
    })) ?? [];

  return {
    data: formattedWorkerpools,
    isLoading,
    isRefetching,
    isError,
    additionalPages,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

export function AddressWorkerpoolsTable({
  addressAddress,
}: {
  addressAddress: string;
}) {
  const [currentPage, setCurrentPage] = usePageParam('addressWorkerpoolsPage');
  const {
    data: workerpools,
    isError,
    isLoading,
    isRefetching,
    additionalPages,
    hasPastError,
  } = useAddressWorkerpoolsData({
    addressAddress,
    currentPage: currentPage - 1,
  });

  const filteredColumns = columns.filter(
    (col) => col.accessorKey !== 'owner.address'
  );

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 font-extrabold">
        Latests workerpools
        {!workerpools && isError && (
          <span className="text-muted-foreground text-sm font-light">
            (outdated)
          </span>
        )}
        {(isLoading || isRefetching) && (
          <LoaderCircle className="animate-spin" />
        )}
      </h2>
      {hasPastError && !workerpools.length ? (
        <ErrorAlert message="An error occurred during address workerpools loading." />
      ) : (
        <DataTable
          columns={filteredColumns}
          data={workerpools}
          tableLength={PREVIEW_TABLE_LENGTH}
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
