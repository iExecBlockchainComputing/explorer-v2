import { PREVIEW_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { usePageParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/datasets/datasetsTable/columns';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { getAdditionalPages } from '@/utils/format';
import { addressDatasetsQuery } from './addressDatasetsQuery';

function useAddressDatasetsData({
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
    'datasets',
    addressAddress,
    currentPage,
  ];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(addressDatasetsQuery, chainId, {
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

  const datasets = data?.account?.datasets ?? [];
  // 0 = only current, 1 = next, 2 = next+1
  const additionalPages = getAdditionalPages(
    Boolean(data?.account?.datasetsHasNext?.length),
    Boolean(data?.account?.datasetsHasNextNext?.length)
  );

  const datasetsDatasets =
    datasets.map((dataset) => ({
      ...dataset,
      destination: `/dataset/${dataset.address}`,
    })) ?? [];

  return {
    data: datasetsDatasets,
    isLoading,
    isRefetching,
    isError,
    additionalPages,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

export function AddressDatasetsTable({
  addressAddress,
}: {
  addressAddress: string;
}) {
  const [currentPage, setCurrentPage] = usePageParam('addressDatasetsPage');
  const {
    data: datasets,
    isError,
    isLoading,
    isRefetching,
    additionalPages,
    hasPastError,
  } = useAddressDatasetsData({ addressAddress, currentPage: currentPage - 1 });

  const filteredColumns = columns.filter(
    (col) => col.accessorKey !== 'owner.address'
  );

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 font-extrabold">
        Latests datasets
        {!datasets && isError && (
          <span className="text-muted-foreground text-sm font-light">
            (outdated)
          </span>
        )}
        {(isLoading || isRefetching) && (
          <LoaderCircle className="animate-spin" />
        )}
      </h2>
      {hasPastError && !datasets.length ? (
        <ErrorAlert message="A error occurred during address datasets loading." />
      ) : (
        <DataTable
          columns={filteredColumns}
          data={datasets}
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
