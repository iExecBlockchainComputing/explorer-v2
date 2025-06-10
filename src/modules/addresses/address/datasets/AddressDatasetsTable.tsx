import { PREVIEW_TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { columns } from '@/modules/datasets/datasetsTable/columns';
import useUserStore from '@/stores/useUser.store';
import { addressDatasetsQuery } from './addressDatasetsQuery';
import { nextAddressDatasetsQuery } from './nextAddressDatasetsQuery';

function useAddressDatasetsData({
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
      queryKey: [chainId, 'address', 'datasets', addressAddress, currentPage],
      queryFn: () =>
        execute(addressDatasetsQuery, chainId, {
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
      'datasets-next',
      addressAddress,
      currentPage,
    ],
    queryFn: () =>
      execute(nextAddressDatasetsQuery, chainId, {
        length: PREVIEW_TABLE_LENGTH * 2,
        skip: (currentPage + 1) * PREVIEW_TABLE_LENGTH,
        address: addressAddress,
      }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
  });

  const nextDatasets = nextData?.account?.datasets ?? [];

  const additionalPages = Math.ceil(nextDatasets.length / PREVIEW_TABLE_LENGTH);

  const formattedDeal =
    data?.account?.datasets.map((dataset) => ({
      ...dataset,
      destination: `/dataset/${dataset.address}`,
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

export function AddressDatasetsTable({
  addressAddress,
}: {
  addressAddress: string;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const {
    data: datasets,
    isError,
    isLoading,
    isRefetching,
    additionalPages,
    hasPastError,
  } = useAddressDatasetsData({ addressAddress, currentPage });

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
        currentPage={currentPage + 1}
        totalPages={currentPage + 1 + additionalPages}
        onPageChange={(newPage) => setCurrentPage(newPage - 1)}
      />
    </div>
  );
}
