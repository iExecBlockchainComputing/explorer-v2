import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { App_OrderBy, OrderDirection } from '@/graphql/poco/graphql';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle, SlidersHorizontal } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import AppIcon from '@/components/icons/AppIcon';
import { BackButton } from '@/components/ui/BackButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { useFilterParam } from '@/hooks/useFilterParam';
import { usePageParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { AppBreadcrumbsList } from '@/modules/apps/AppBreadcrumbs';
import { appsQuery } from '@/modules/apps/appsQuery';
import { columns } from '@/modules/apps/appsTable/columns';
import { SearcherBar } from '@/modules/search/SearcherBar';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFn } from '@/utils/createPlaceholderDataFnForQueryKey';
import { getAdditionalPages } from '@/utils/format';

export const Route = createFileRoute('/$chainSlug/_layout/apps')({
  component: AppsRoute,
});

function useAppsData(currentPage: number, orderFilter: string) {
  const { chainId } = useUserStore();
  const skip = currentPage * TABLE_LENGTH;
  const nextSkip = skip + TABLE_LENGTH;
  const nextNextSkip = skip + 2 * TABLE_LENGTH;

  const orderBy = orderFilter === 'pertinent' ? 'usageCount' : 'timestamp';
  const orderDirection = orderFilter === 'oldest' ? 'asc' : 'desc';
  const recentFrom =
    orderFilter === 'pertinent'
      ? Math.floor(Date.now() / 1000) - 14 * 24 * 60 * 60
      : 0;

  const queryKey = [
    chainId,
    'apps',
    currentPage,
    orderBy,
    orderDirection,
    recentFrom,
  ];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(appsQuery, chainId, {
          length: TABLE_LENGTH,
          skip,
          nextSkip,
          nextNextSkip,
          orderBy: orderBy as App_OrderBy,
          orderDirection: orderDirection as OrderDirection,
          recentFrom: recentFrom,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      enabled: !!chainId,
      placeholderData: createPlaceholderDataFn(),
    }
  );

  const apps = data?.apps ?? [];
  // 0 = only current, 1 = next, 2 = next+1
  const additionalPages = getAdditionalPages(
    Boolean(data?.appsHasNext?.length),
    Boolean(data?.appsHasNextNext?.length)
  );

  const formattedApps =
    apps.map((app) => ({
      ...app,
      destination: `/app/${app.address}`,
    })) ?? [];

  return {
    data: formattedApps,
    isLoading,
    isRefetching,
    isError,
    hasPastError: isError || errorUpdateCount > 0,
    additionalPages,
  };
}

function AppsRoute() {
  const orders = [
    { id: 1, value: 'recent', name: 'Recently deployed' },
    { id: 2, value: 'oldest', name: 'Oldest deployed' },
    { id: 3, value: 'pertinent', name: 'Most pertinent' },
  ];
  const allowedOrderValues = orders.map((o) => o.value);
  const [currentPage, setCurrentPage] = usePageParam('appsPage');
  const [orderBy, setOrderBy] = useFilterParam(
    'appsOrderBy',
    allowedOrderValues,
    'pertinent'
  );
  const {
    data,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
    additionalPages,
  } = useAppsData(currentPage - 1, orderBy);

  function handleOrderChange(value: string) {
    setOrderBy(value);
    setCurrentPage(1);
  }

  return (
    <div className="mt-8 grid gap-6">
      <div className="mt-6 flex flex-col justify-between lg:flex-row">
        <div className="flex flex-col items-stretch gap-4 py-6 sm:flex-row lg:order-last lg:mr-0 lg:py-0">
          <SearcherBar className="lg:max-w-md xl:max-w-xl" />
          <Select
            value={orderBy?.toString()}
            onValueChange={handleOrderChange}
            defaultValue="pertinent"
          >
            <SelectTrigger className="m-auto box-content h-9! rounded-2xl">
              <SlidersHorizontal />
              Order by
            </SelectTrigger>
            <SelectContent>
              {orders.map((order) => (
                <SelectItem key={order.id} value={order.value}>
                  {order.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
          <div className="flex items-center gap-2">
            <BackButton />
            <AppBreadcrumbsList />
          </div>
        </div>
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
        currentPage={currentPage}
        totalPages={currentPage + additionalPages}
        onPageChange={setCurrentPage}
        filterKey={orderBy}
      />
    </div>
  );
}
