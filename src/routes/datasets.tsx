import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Box, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { SearcherBar } from '@/modules/SearcherBar';
import { datasetsQuery } from '@/modules/datasets/datasetsQuery';
import { columns } from '@/modules/datasets/datasetsTable/columns';
import { nextDatasetsQuery } from '@/modules/datasets/nextDatasetsQuery';
import useUserStore from '@/stores/useUser.store';

export const Route = createFileRoute('/datasets')({
  component: DatasetsRoute,
});

function useDatasetsData(currentPage: number) {
  const { subgraphUrl } = useUserStore();
  const skip = currentPage * TABLE_LENGTH;

  const { data, isLoading, isRefetching, isError } = useQuery({
    queryKey: ['datasets', currentPage],
    queryFn: () =>
      execute(datasetsQuery, subgraphUrl, { length: TABLE_LENGTH, skip }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
  });

  const { data: nextData } = useQuery({
    queryKey: ['datasets-next', currentPage],
    queryFn: () =>
      execute(nextDatasetsQuery, subgraphUrl, {
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
    isError,
    additionalPages,
  };
}

function DatasetsRoute() {
  const [currentPage, setCurrentPage] = useState(0);
  const { data, isLoading, isRefetching, isError, additionalPages } =
    useDatasetsData(currentPage);

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

      <DataTable
        columns={columns}
        data={data}
        tableLength={TABLE_LENGTH}
        isLoading={isLoading || isRefetching}
      />
      <PaginatedNavigation
        currentPage={currentPage + 1}
        totalPages={currentPage + 1 + additionalPages}
        onPageChange={(newPage) => setCurrentPage(newPage - 1)}
      />
    </div>
  );
}
