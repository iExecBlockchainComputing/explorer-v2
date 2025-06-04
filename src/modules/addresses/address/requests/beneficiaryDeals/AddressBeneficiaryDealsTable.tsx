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
import { addressBeneficiaryDealsQuery } from './addressBeneficiaryDealsQuery';
import { nextAddressBeneficiaryDealsQuery } from './nextAddressBeneficiaryDealsQuery';

function useAddressBeneficiaryDealsData({
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
      queryKey: ['address', 'beneficiaryDeals', addressAddress],
      queryFn: () =>
        execute(addressBeneficiaryDealsQuery, chainId, {
          length: PREVIEW_TABLE_LENGTH,
          skip,
          address: addressAddress,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
    }
  );

  const { data: nextData } = useQuery({
    queryKey: [chainId, 'beneficiaryDeals-next', currentPage],
    queryFn: () =>
      execute(nextAddressBeneficiaryDealsQuery, chainId, {
        length: PREVIEW_TABLE_LENGTH * 2,
        skip: (currentPage + 1) * PREVIEW_TABLE_LENGTH,
        address: addressAddress,
      }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
  });

  const nextBeneficiaryDeals = nextData?.account?.dealBeneficiary ?? [];

  const additionalPages = Math.ceil(
    nextBeneficiaryDeals.length / PREVIEW_TABLE_LENGTH
  );

  console.log('useAddressBeneficiaryDealsData', data);

  const formattedDeal =
    data?.account?.dealBeneficiary.map((deal) => ({
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
  console.log('AddressBeneficiaryDealsTable rendered', addressAddress);

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
