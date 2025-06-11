import { PREVIEW_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/workerpools/workerpoolsTable/columns';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { addressWorkerpoolsQuery } from './addressWorkerpoolsQuery';
import { nextAddressWorkerpoolsQuery } from './nextAddressWorkerpoolsQuery';

function useAddressWorkerpoolsData({
  addressAddress,
  currentPage,
}: {
  addressAddress: string;
  currentPage: number;
}) {
  const { chainId } = useUserStore();
  const skip = currentPage * PREVIEW_TABLE_LENGTH;

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
          address: addressAddress,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  const queryKeyNextData = [
    chainId,
    'address',
    'workerpools-next',
    addressAddress,
    currentPage,
  ];
  const { data: nextData } = useQuery({
    queryKey: queryKeyNextData,
    queryFn: () =>
      execute(nextAddressWorkerpoolsQuery, chainId, {
        length: PREVIEW_TABLE_LENGTH * 2,
        skip: (currentPage + 1) * PREVIEW_TABLE_LENGTH,
        address: addressAddress,
      }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
    placeholderData: createPlaceholderDataFnForQueryKey(queryKeyNextData),
  });

  const nextWorkerpools = nextData?.account?.workerpools ?? [];

  const additionalPages = Math.ceil(
    nextWorkerpools.length / PREVIEW_TABLE_LENGTH
  );

  const formattedDeal =
    data?.account?.workerpools.map((workerpool) => ({
      ...workerpool,
      destination: `/workerpool/${workerpool.address}`,
    })) ?? [];

  return {
    data: formattedDeal,
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
  const [currentPage, setCurrentPage] = useState(0);
  const {
    data: workerpools,
    isError,
    isLoading,
    isRefetching,
    additionalPages,
    hasPastError,
  } = useAddressWorkerpoolsData({ addressAddress, currentPage });

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
        <ErrorAlert message="A error occurred during address workerpools loading." />
      ) : (
        <DataTable
          columns={filteredColumns}
          data={workerpools}
          tableLength={PREVIEW_TABLE_LENGTH}
        />
      )}
      <PaginatedNavigation
        currentPage={currentPage + 1}
        totalPages={currentPage + 1 + additionalPages}
        onPageChange={(newPage) => setCurrentPage(newPage - 1)}
      />
    </div>
  );
}
