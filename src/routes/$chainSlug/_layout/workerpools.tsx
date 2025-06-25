import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import WorkerpoolIcon from '@/components/icons/WorkerpoolIcon';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { SearcherBar } from '@/modules/search/SearcherBar';
import { nextWorkerpoolsQuery } from '@/modules/workerpools/nextWorkerpoolsQuery';
import { workerpoolsQuery } from '@/modules/workerpools/workerpoolsQuery';
import { columns } from '@/modules/workerpools/workerpoolsTable/columns';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

export const Route = createFileRoute('/$chainSlug/_layout/workerpools')({
  component: WorkerpoolsRoute,
});

function useWorkerpoolsData(currentPage: number) {
  const { chainId } = useUserStore();
  const skip = currentPage * TABLE_LENGTH;

  const queryKey = [chainId, 'workerpools', currentPage];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(workerpoolsQuery, chainId, { length: TABLE_LENGTH, skip }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      enabled: !!chainId,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  const queryKeyNextData = [chainId, 'workerpools-next', currentPage];
  const { data: nextData } = useQuery({
    queryKey: [chainId, 'workerpools-next', currentPage],
    queryFn: () =>
      execute(nextWorkerpoolsQuery, chainId, {
        length: TABLE_LENGTH * 2,
        skip: (currentPage + 1) * TABLE_LENGTH,
      }),
    refetchInterval: TABLE_REFETCH_INTERVAL,
    enabled: !!chainId,
    placeholderData: createPlaceholderDataFnForQueryKey(queryKeyNextData),
  });

  const nextWorkerpools = nextData?.workerpools ?? [];

  const additionalPages = Math.ceil(nextWorkerpools.length / TABLE_LENGTH);

  const formattedData =
    data?.workerpools.map((workerpool) => ({
      ...workerpool,
      destination: `/workerpool/${workerpool.address}`,
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

function WorkerpoolsRoute() {
  const [currentPage, setCurrentPage] = useState(0);
  const {
    data,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
    additionalPages,
  } = useWorkerpoolsData(currentPage);

  return (
    <div className="mt-8 grid gap-6">
      <SearcherBar className="py-10" />

      <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
        <WorkerpoolIcon size={24} />
        Workerpools
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
        <ErrorAlert message="An error occurred during workerpools details  loading." />
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
