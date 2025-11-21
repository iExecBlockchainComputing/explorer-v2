import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import DealIcon from '@/components/icons/DealIcon';
import { BackButton } from '@/components/ui/BackButton';
import { useTabParam } from '@/hooks/usePageParam';
import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { Tabs } from '@/modules/Tabs';
import { DealAssociatedDealsTable } from '@/modules/deals/deal/DealAssociatedDealsTable';
import { DealBreadcrumbs } from '@/modules/deals/deal/DealBreadcrumbs';
import { DealTasksTable } from '@/modules/deals/deal/DealTasksTable';
import { buildDealDetails } from '@/modules/deals/deal/buildDealDetails';
import { dealAssociatedDealsQuery } from '@/modules/deals/deal/dealAssociatedDealsQuery';
import { dealQuery } from '@/modules/deals/deal/dealQuery';
import { SearcherBar } from '@/modules/search/SearcherBar';
import useUserStore from '@/stores/useUser.store';
import { NotFoundError } from '@/utils/NotFoundError';
import { isValidId } from '@/utils/addressOrIdCheck';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

export const Route = createFileRoute('/$chainSlug/_layout/deal/$dealId')({
  component: DealsRoute,
});

function useDealData(dealId: string, chainId: number) {
  const isValid = isValidId(dealId);
  const queryKey = [chainId, 'deal', dealId];
  const { data, isLoading, isRefetching, isError, error, errorUpdateCount } =
    useQuery({
      queryKey,
      enabled: !!chainId && isValid,
      queryFn: async () => {
        const result = await execute(dealQuery, chainId, {
          length: TABLE_LENGTH,
          dealId,
        });
        if (!result?.deal) {
          throw new NotFoundError();
        }
        return result;
      },
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    });

  return {
    data: data?.deal,
    isLoading,
    isRefetching,
    isError,
    error,
    hasPastError: isError || errorUpdateCount > 0,
    isValid,
  };
}

function DealsRoute() {
  const tabLabels = ['DETAILS', 'TASKS', 'ASSOCIATED DEALS'];
  const [currentTab, setCurrentTab] = useTabParam('dealTab', tabLabels, 0);
  const { chainId, isConnected } = useUserStore();
  const { dealId } = Route.useParams();
  const {
    data: deal,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
    isValid,
    error,
  } = useDealData((dealId as string).toLowerCase(), chainId!);

  const associatedDealsPresenceQueryKey = [
    chainId,
    'deal',
    'associatedDealsPresence',
    dealId,
  ];
  const { data: associatedDealsPresence } = useQuery({
    queryKey: associatedDealsPresenceQueryKey,
    enabled: !!dealId && !!chainId && !!deal && currentTab !== 2,
    queryFn: () =>
      execute(dealAssociatedDealsQuery, chainId!, {
        length: 1,
        skip: 0,
        nextSkip: 1,
        nextNextSkip: 2,
        dealId: dealId,
      }),
    placeholderData: (prev) => prev,
  });
  const hasAssociatedDeals =
    (associatedDealsPresence?.deal?.requestorder?.deals?.length || 0) > 0;

  const [isLoadingChild, setIsLoadingChild] = useState(false);
  const [isOutdatedChild, setIsOutdatedChild] = useState(false);

  const dealDetails = deal
    ? buildDealDetails({
        deal,
        isConnected,
        onSeeTasks: () => setCurrentTab(1),
      })
    : undefined;

  if (!isValid) {
    return <ErrorAlert className="my-16" message="Invalid deal address." />;
  }

  if (isError && error instanceof NotFoundError) {
    return <ErrorAlert className="my-16" message="Deal not found." />;
  }

  const showOutdated = deal && (isError || isOutdatedChild);
  const showLoading = isLoading || isRefetching || isLoadingChild;

  return (
    <div className="mt-8 flex flex-col gap-6">
      <div className="mt-6 flex flex-col justify-between lg:flex-row">
        <SearcherBar className="py-6 lg:order-last lg:mr-0 lg:max-w-md lg:py-0 xl:max-w-xl" />
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
            <DealIcon size={24} />
            Deal details
            {showOutdated && (
              <span className="text-muted-foreground text-sm font-light">
                (outdated)
              </span>
            )}
            {showLoading && <LoaderCircle className="animate-spin" />}
          </h1>
          <div className="flex items-center gap-2">
            <BackButton />
            <DealBreadcrumbs dealId={dealId} />
          </div>
        </div>
      </div>

      <Tabs
        currentTab={currentTab}
        tabLabels={tabLabels}
        onTabChange={setCurrentTab}
        disabledTabs={deal && !hasAssociatedDeals ? [2] : []}
        disabledReasons={
          deal && !hasAssociatedDeals ? { 2: 'No associated deals' } : {}
        }
      />
      <div>
        {currentTab === 0 &&
          (hasPastError && !dealDetails ? (
            <ErrorAlert message="An error occurred during deal details loading." />
          ) : (
            <DetailsTable details={dealDetails || {}} />
          ))}
        {currentTab === 1 && (
          <DealTasksTable
            dealId={dealId}
            setLoading={setIsLoadingChild}
            setOutdated={setIsOutdatedChild}
          />
        )}
        {currentTab === 2 && (
          <DealAssociatedDealsTable
            dealId={dealId}
            setLoading={setIsLoadingChild}
            setOutdated={setIsOutdatedChild}
          />
        )}
      </div>
    </div>
  );
}
