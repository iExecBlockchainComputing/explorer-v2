import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import DatasetIcon from '@/components/icons/DatasetIcon';
import { BackButton } from '@/components/ui/BackButton';
import { usePageParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { DatasetBreadcrumbsList } from '@/modules/datasets/DatasetBreadcrumbs';
import { datasetsQuery } from '@/modules/datasets/datasetsQuery';
import { columns } from '@/modules/datasets/datasetsTable/columns';
import { SearcherBar } from '@/modules/search/SearcherBar';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { getAdditionalPages } from '@/utils/format';

export const Route = createFileRoute('/$chainSlug/_layout/datasets')({
  component: DatasetsRoute,
});

function useDatasetsData(currentPage: number) {
  const { chainId } = useUserStore();
  const skip = currentPage * TABLE_LENGTH;
  const nextSkip = skip + TABLE_LENGTH;
  const nextNextSkip = skip + 2 * TABLE_LENGTH;

  const queryKey = [chainId, 'datasets', currentPage];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(datasetsQuery, chainId, {
          length: TABLE_LENGTH,
          skip,
          nextSkip,
          nextNextSkip,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      enabled: !!chainId,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  const datasets = data?.datasets ?? [];
  // 0 = only current, 1 = next, 2 = next+1
  const additionalPages = getAdditionalPages(
    Boolean(data?.datasetsHasNext?.length),
    Boolean(data?.datasetsHasNextNext?.length)
  );

  const formattedDatasets =
    datasets.map((dataset) => ({
      ...dataset,
      destination: `/dataset/${dataset.address}`,
    })) ?? [];

  return {
    data: formattedDatasets,
    isLoading,
    isRefetching,
    isError: isError,
    hasPastError: isError || errorUpdateCount > 0,
    additionalPages,
  };
}

function DatasetsRoute() {
  const [currentPage, setCurrentPage] = usePageParam('datasetsPage');
  const {
    data,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
    additionalPages,
  } = useDatasetsData(currentPage - 1);

  return (
    <div className="mt-8 grid gap-6">
      <SearcherBar className="py-6" />

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
        <div className="flex items-center gap-2">
          <BackButton />
          <DatasetBreadcrumbsList />
        </div>
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
        currentPage={currentPage}
        totalPages={currentPage + additionalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
