import { PREVIEW_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/deals/dealsTable/columns';
import useUserStore from '@/stores/useUser.store';
import { addressRequestedDealsQuery } from './addressRequestedDealsQuery';
import { nextAddressRequestedDealsQuery } from './nextAddressRequestedDealsQuery';

function useAddressRequestedDealsData({
  addressAddress,
  currentPage,
}: {
  addressAddress: string;
  currentPage: number;
}) {
  const { chainId } = useUserStore();
  const skip = currentPage * PREVIEW_TABLE_LENGTH;

  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey: [
        chainId,
        'address',
        'requestedDeals',
        addressAddress,
        currentPage,
      ],
      queryFn: () =>
        execute(addressRequestedDealsQuery, chainId, {
          length: PREVIEW_TABLE_LENGTH,
          skip,
          address: addressAddress,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
    }
  );

  const { data: nextData } = useQuery({
    queryKey: [
      chainId,
      'address',
      'requestedDeals-next',
      addressAddress,
      currentPage,
    ],
    queryFn: () =>
      execute(nextAddressRequestedDealsQuery, chainId, {
        length: PREVIEW_TABLE_LENGTH * 2,
        skip: (currentPage + 1) * PREVIEW_TABLE_LENGTH,
        address: addressAddress,
      }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
  });

  const nextRequestedDeals = nextData?.account?.dealRequester ?? [];

  const additionalPages = Math.ceil(
    nextRequestedDeals.length / PREVIEW_TABLE_LENGTH
  );

  const formattedDeal =
    data?.account?.dealRequester.map((deal) => ({
      ...deal,
      destination: `/deal/${deal.dealid}`,
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

export function AddressRequestedDealsTable({
  addressAddress,
}: {
  addressAddress: string;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const {
    data: requestedDeals,
    isError,
    isLoading,
    isRefetching,
    additionalPages,
    hasPastError,
  } = useAddressRequestedDealsData({ addressAddress, currentPage });

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 font-extrabold">
        Latests requested deals
        {!requestedDeals && isError && (
          <span className="text-muted-foreground text-sm font-light">
            (outdated)
          </span>
        )}
        {(isLoading || isRefetching) && (
          <LoaderCircle className="animate-spin" />
        )}
      </h2>
      {hasPastError && !requestedDeals.length ? (
        <ErrorAlert message="A error occurred during address requestedDeals loading." />
      ) : (
        <DataTable
          columns={columns}
          data={requestedDeals}
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
