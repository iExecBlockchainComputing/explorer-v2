import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PaginatedNavigation } from '@/components/PaginatedNavigation';
import DealIcon from '@/components/icons/DealIcon';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { AllDealsBreadcrumbs } from '@/modules/deals/DealBreadcrumbs';
import { dealsQuery } from '@/modules/deals/dealsQuery';
import { columns } from '@/modules/deals/dealsTable/columns';
import { SearcherBar } from '@/modules/search/SearcherBar';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

export const Route = createFileRoute('/$chainSlug/_layout/deals')({
  component: DealsRoute,
});

function useDealsData(currentPage: number) {
  const { chainId } = useUserStore();
  const skip = currentPage * TABLE_LENGTH;
  const nextSkip = skip + TABLE_LENGTH;
  const nextNextSkip = skip + 2 * TABLE_LENGTH;

  const queryKey = [chainId, 'deals', currentPage];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(dealsQuery, chainId, {
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

  const deals = data?.deals ?? [];
  const hasNextPage = (data?.dealsHasNext?.length ?? 0) > 0;
  const hasNextNextPage = (data?.dealsHasNextNext?.length ?? 0) > 0;
  // 0 = only current, 1 = next, 2 = next+1
  const additionalPages = hasNextPage ? (hasNextNextPage ? 2 : 1) : 0;

  const formattedData =
    deals.map((deal) => ({
      ...deal,
      destination: `/deal/${deal.dealid}`,
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

function DealsRoute() {
  const [currentPage, setCurrentPage] = useState(0);
  const {
    data,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
    additionalPages,
  } = useDealsData(currentPage);

  return (
    <div className="mt-8 grid gap-6">
      <SearcherBar className="py-10" />

      <div className="space-y-2">
        <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
          <DealIcon size={24} />
          Deals
          {data.length > 0 && isError && (
            <span className="text-muted-foreground text-sm font-light">
              (outdated)
            </span>
          )}
          {(isLoading || isRefetching) && (
            <LoaderCircle className="animate-spin" />
          )}
        </h1>
        <AllDealsBreadcrumbs />
      </div>
      {hasPastError && !data.length ? (
        <ErrorAlert message="An error occurred during deals loading." />
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
