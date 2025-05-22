import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Box, LoaderCircle, Terminal } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { SearcherBar } from '@/modules/SearcherBar';
import { datasetsQuery } from '@/modules/datasets/datasetsQuery';
import { columns } from '@/modules/datasets/datasetsTable/columns';
import { nextDatasetsQuery } from '@/modules/datasets/nextDatasetsQuery';
import useUserStore from '@/stores/useUser.store';

export const Route = createFileRoute('/$chainSlug/_layout/datasets')({
  component: DatasetsRoute,
});

function useDatasetsData(currentPage: number) {
  const { chainId } = useUserStore();
  const skip = currentPage * TABLE_LENGTH;

  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey: [chainId, 'datasets', currentPage],
      queryFn: () =>
        execute(datasetsQuery, chainId, { length: TABLE_LENGTH, skip }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
    }
  );

  const { data: nextData } = useQuery({
    queryKey: [chainId, 'datasets-next', currentPage],
    queryFn: () =>
      execute(nextDatasetsQuery, chainId, {
        length: TABLE_LENGTH * 2,
        skip: (currentPage + 1) * TABLE_LENGTH,
      }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
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

      <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
        <Box size="20" />
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

      {hasPastError && !data.length ? (
        <Alert variant="destructive" className="mx-auto w-fit text-left">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            A error occurred during datasets loading.
          </AlertDescription>
        </Alert>
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
