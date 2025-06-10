import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Box, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { SearcherBar } from '@/modules/SearcherBar';
import { Tabs } from '@/modules/Tabs';
import { DealBreadcrumbs } from '@/modules/deals/deal/DealBreadcrumbs';
import { DealTasksTable } from '@/modules/deals/deal/DealTasksTable';
import { buildDealDetails } from '@/modules/deals/deal/buildDealDetails';
import { dealQuery } from '@/modules/deals/deal/dealQuery';
import useUserStore from '@/stores/useUser.store';

export const Route = createFileRoute('/$chainSlug/_layout/deal/$dealAddress')({
  component: DealsRoute,
});

function useDealData(dealAddress: string, chainId: number) {
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey: ['deal', dealAddress],
      queryFn: () =>
        execute(dealQuery, chainId, { length: TABLE_LENGTH, dealAddress }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: keepPreviousData,
    }
  );

  return {
    data: data?.deal,
    isLoading,
    isRefetching,
    isError,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

function DealsRoute() {
  const [currentTab, setCurrentTab] = useState(0);
  const { chainId, isConnected } = useUserStore();
  const { dealAddress } = Route.useParams();
  const {
    data: deal,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
  } = useDealData(dealAddress, chainId!);

  // if (!deal) {
  //   return <p>Hum there is nothing here..</p>;
  // }
  const dealDetails = deal
    ? buildDealDetails({ deal, isConnected })
    : undefined;

  return (
    <div className="mt-8 flex flex-col gap-6">
      <SearcherBar className="py-10" />

      <div className="space-y-2">
        <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
          <Box size="20" />
          Deal details
          {!deal && isError && (
            <span className="text-muted-foreground text-sm font-light">
              (outdated)
            </span>
          )}
          {(isLoading || isRefetching) && (
            <LoaderCircle className="animate-spin" />
          )}
        </h1>
        <DealBreadcrumbs dealId={dealAddress} />
      </div>

      <Tabs
        currentTab={currentTab}
        tabLabels={['DETAILS', 'TASKS']}
        onTabChange={setCurrentTab}
      />
      <div>
        {currentTab === 0 &&
          (hasPastError && !dealDetails ? (
            <ErrorAlert message="An error occurred during deal details  loading." />
          ) : (
            <DetailsTable details={dealDetails} />
          ))}
        {currentTab === 1 && <DealTasksTable dealAddress={dealAddress} />}
      </div>
    </div>
  );
}
