import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import AppIcon from '@/components/icons/AppIcon';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { AppBreadcrumbsList } from '@/modules/apps/AppBreadcrumbs';
import { appsQuery } from '@/modules/apps/appsQuery';
import { columns } from '@/modules/apps/appsTable/columns';
import { SearcherBar } from '@/modules/search/SearcherBar';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

export const Route = createFileRoute('/$chainSlug/_layout/apps')({
  component: AppsRoute,
});

function useAppsData(currentPage: number) {
  const { chainId } = useUserStore();
  const skip = currentPage * TABLE_LENGTH;
  const nextSkip = skip + TABLE_LENGTH;
  const nextNextSkip = skip + 2 * TABLE_LENGTH;

  const queryKey = [chainId, 'apps', currentPage];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(appsQuery, chainId, {
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

  const apps = data?.apps ?? [];
  const hasNextPage = (data?.appsHasNext?.length ?? 0) > 0;
  const hasNextNextPage = (data?.appsHasNextNext?.length ?? 0) > 0;
  // 0 = only current, 1 = next, 2 = next+1
  const additionalPages = hasNextPage ? (hasNextNextPage ? 2 : 1) : 0;

  const formattedData =
    apps.map((app) => ({
      ...app,
      destination: `/app/${app.address}`,
    })) ?? [];

  return {
    data: formattedData,
    isLoading,
    isRefetching,
    isError,
    hasPastError: isError || errorUpdateCount > 0,
    additionalPages,
  };
}

function AppsRoute() {
  const [currentPage, setCurrentPage] = useState(0);
  const {
    data,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
    additionalPages,
  } = useAppsData(currentPage);

  return (
    <div className="mt-8 grid gap-6">
      <SearcherBar className="py-10" />

      <div className="space-y-2">
        <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
          <AppIcon size={24} />
          Apps deployed
          {data.length > 0 && isError && (
            <span className="text-muted-foreground text-sm font-light">
              (outdated)
            </span>
          )}
          {isLoading && isRefetching && (
            <LoaderCircle className="animate-spin" />
          )}
        </h1>
        <AppBreadcrumbsList />
      </div>

      {hasPastError && !data.length ? (
        <ErrorAlert message="An error occurred during apps loading." />
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
