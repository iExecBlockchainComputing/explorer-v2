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
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { addressBeneficiaryDealsQuery } from './addressBeneficiaryDealsQuery';

function useAddressBeneficiaryDealsData({
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
    'beneficiaryDeals',
    addressAddress,
    currentPage,
  ];

  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(addressBeneficiaryDealsQuery, chainId, {
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

  const beneficiaryDeals = data?.account?.dealBeneficiary ?? [];
  const hasNextPage = (data?.account?.dealBeneficiaryHasNext?.length ?? 0) > 0;
  const hasNextNextPage =
    (data?.account?.dealBeneficiaryHasNextNext?.length ?? 0) > 0;
  // 0 = only current, 1 = next, 2 = next+1
  const additionalPages = hasNextPage ? (hasNextNextPage ? 2 : 1) : 0;

  const formattedDeal =
    beneficiaryDeals.map((deal) => ({
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

export function AddressBeneficiaryDealsTable({
  addressAddress,
}: {
  addressAddress: string;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const {
    data: beneficiaryDeals,
    isError,
    isLoading,
    isRefetching,
    additionalPages,
    hasPastError,
  } = useAddressBeneficiaryDealsData({ addressAddress, currentPage });

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 font-extrabold">
        Latests beneficiary deals
        {!beneficiaryDeals && isError && (
          <span className="text-muted-foreground text-sm font-light">
            (outdated)
          </span>
        )}
        {(isLoading || isRefetching) && (
          <LoaderCircle className="animate-spin" />
        )}
      </h2>
      {hasPastError && !beneficiaryDeals.length ? (
        <ErrorAlert message="A error occurred during address beneficiaryDeals loading." />
      ) : (
        <DataTable
          columns={columns}
          data={beneficiaryDeals}
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
