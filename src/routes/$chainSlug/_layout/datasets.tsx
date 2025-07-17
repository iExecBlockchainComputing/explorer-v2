import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import DatasetIcon from '@/components/icons/DatasetIcon';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { DatasetBreadcrumbsList } from '@/modules/datasets/DatasetBreadcrumbs';
import { datasetsQuery } from '@/modules/datasets/datasetsQuery';
import { columns } from '@/modules/datasets/datasetsTable/columns';
import { nextDatasetsQuery } from '@/modules/datasets/nextDatasetsQuery';
import { SearcherBar } from '@/modules/search/SearcherBar';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

export const Route = createFileRoute('/$chainSlug/_layout/datasets')({
  component: DatasetsRoute,
});

function useDatasetsData(currentPage: number) {
  const { chainId } = useUserStore();
  const skip = currentPage * TABLE_LENGTH;

  const queryKey = [chainId, 'datasets', currentPage];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(datasetsQuery, chainId, { length: TABLE_LENGTH, skip }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      enabled: !!chainId,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  const queryKeyNextData = [chainId, 'datasets-next', currentPage];
  const { data: nextData } = useQuery({
    queryKey: queryKeyNextData,
    queryFn: () =>
      execute(nextDatasetsQuery, chainId, {
        length: TABLE_LENGTH * 2,
        skip: (currentPage + 1) * TABLE_LENGTH,
      }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
    enabled: !!chainId,
    placeholderData: createPlaceholderDataFnForQueryKey(queryKeyNextData),
  });

  const nextDatasets = nextData?.datasets ?? [];

  const additionalPages = Math.ceil(nextDatasets.length / TABLE_LENGTH);

  const formattedData =
    data?.datasets.map((dataset) => ({
      ...dataset,
      destination: `/dataset/${dataset.address}`,
    })) ?? [];

  return {
    data: formattedData,
    isLoading,
    isRefetching,
    isError: isError,
    hasPastError: isError || errorUpdateCount > 0,
    additionalPages,
  };
}

function DatasetsRoute() {
  const [currentPage, setCurrentPage] = useState(0);
  const {
    data,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
    additionalPages,
  } = useDatasetsData(currentPage);

  return (
    <div className="mt-8 grid gap-6">
      <SearcherBar className="py-10" />

      <div className="space-y-2">
        <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
          <DatasetIcon size={24} />
          Datasets
          {data.length > 0 && isError && (
            <span className="text-muted-foreground text-sm font-light">
              (outdated)
            </span>
          )}
          {(isLoading || isRefetching) && (
            <LoaderCircle className="animate-spin" />
          )}
        </h1>
        <DatasetBreadcrumbsList />
      </div>

      {hasPastError && !data.length ? (
        <ErrorAlert message="An error occurred during datasets loading." />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          tableLength={TABLE_LENGTH}
          isLoading={isLoading || isRefetching}
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
