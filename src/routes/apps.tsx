import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Box, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import { SearcherBar } from '@/modules/SearcherBar';
import { appsQuery } from '@/modules/apps/appsQuery';
import { columns } from '@/modules/apps/appsTable/columns';

export const Route = createFileRoute('/apps')({
  component: AppsRoute,
});

function useAppsData(currentPage: number) {
  const skip = currentPage * TABLE_LENGTH;

  const { data, isLoading, isRefetching, isError } = useQuery({
    queryKey: ['apps', currentPage],
    queryFn: () => execute(appsQuery, { length: TABLE_LENGTH, skip }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
  });

  const formattedData =
    data?.apps.map((app) => ({
      ...app,
      destination: `/app/${app.address}`,
    })) ?? [];

  return { data: formattedData, isLoading, isRefetching, isError };
}

function AppsRoute() {
  const [currentPage, setCurrentPage] = useState(0);
  const { data, isLoading, isRefetching, isError } = useAppsData(currentPage);

  return (
    <div className="mt-8 grid gap-6">
      <SearcherBar className="py-10" />

      <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
        <Box size="20" />
        Apps deployed
        {data.length > 0 && isError && (
          <span className="text-muted-foreground text-sm font-light">
            (outdated)
          </span>
        )}
        {isLoading && isRefetching && <LoaderCircle className="animate-spin" />}
      </h1>

      <DataTable
        columns={columns}
        data={data}
        tableLength={TABLE_LENGTH}
        isLoading={isLoading || isRefetching}
      />
      <PaginatedNavigation
        currentPage={currentPage}
        totalPages={currentPage + 2}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
