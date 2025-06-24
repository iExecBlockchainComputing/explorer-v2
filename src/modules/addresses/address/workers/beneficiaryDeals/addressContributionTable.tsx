import { PREVIEW_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { ErrorAlert } from '@/modules/ErrorAlert';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { addressContributionQuery } from './addressContributionQuery';
import { columns } from './columns';
import { nextAddressContributionQuery } from './nextAddressContributionQuery';

function useAddressContributionData({
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
    'contribution',
    addressAddress,
    currentPage,
  ];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(addressContributionQuery, chainId, {
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
    'contribution-next',
    addressAddress,
    currentPage,
  ];
  const { data: nextData } = useQuery({
    queryKey: queryKeyNextData,
    queryFn: () =>
      execute(nextAddressContributionQuery, chainId, {
        length: PREVIEW_TABLE_LENGTH * 2,
        skip: (currentPage + 1) * PREVIEW_TABLE_LENGTH,
        address: addressAddress,
      }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
    placeholderData: createPlaceholderDataFnForQueryKey(queryKeyNextData),
  });

  const nextContribution = nextData?.account?.contributions ?? [];

  const additionalPages = Math.ceil(
    nextContribution.length / PREVIEW_TABLE_LENGTH
  );

  const formattedDeal =
    data?.account?.contributions.map((contribution) => ({
      ...contribution,
      destination: `/task/${contribution.task.taskid}`,
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

export function AddressContributionTable({
  addressAddress,
}: {
  addressAddress: string;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const {
    data: contribution,
    isError,
    isLoading,
    isRefetching,
    additionalPages,
    hasPastError,
  } = useAddressContributionData({ addressAddress, currentPage });
  console.log('AddressContributionTable', contribution);

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 font-extrabold">
        Contributions
        {!contribution && isError && (
          <span className="text-muted-foreground text-sm font-light">
            (outdated)
          </span>
        )}
        {(isLoading || isRefetching) && (
          <LoaderCircle className="animate-spin" />
        )}
      </h2>
      {hasPastError && !contribution.length ? (
        <ErrorAlert message="A error occurred during address contribution loading." />
      ) : (
        <DataTable
          columns={columns}
          data={contribution}
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
