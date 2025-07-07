import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import DealIcon from '@/components/icons/DealIcon';
import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { Tabs } from '@/modules/Tabs';
import { DealBreadcrumbs } from '@/modules/deals/deal/DealBreadcrumbs';
import { DealTasksTable } from '@/modules/deals/deal/DealTasksTable';
import { buildDealDetails } from '@/modules/deals/deal/buildDealDetails';
import { dealQuery } from '@/modules/deals/deal/dealQuery';
import { SearcherBar } from '@/modules/search/SearcherBar';
import useUserStore from '@/stores/useUser.store';
import { NotFoundError } from '@/utils/NotFoundError';
import { isValidDealAddress } from '@/utils/addressOrIdCheck';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

export const Route = createFileRoute('/$chainSlug/_layout/deal/$dealAddress')({
  component: DealsRoute,
});

function useDealData(dealAddress: string, chainId: number) {
  const isValid = isValidDealAddress(dealAddress);
  const queryKey = [chainId, 'deal', dealAddress];
  const { data, isLoading, isRefetching, isError, error, errorUpdateCount } =
    useQuery({
      queryKey,
      enabled: !!chainId && isValid,
      queryFn: async () => {
        const result = await execute(dealQuery, chainId, {
          length: TABLE_LENGTH,
          dealAddress,
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
  const [currentTab, setCurrentTab] = useState(0);
  const { chainId, isConnected } = useUserStore();
  const { dealAddress } = Route.useParams();
  const {
    data: deal,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
    isValid,
    error,
  } = useDealData(dealAddress, chainId!);

  const dealDetails = deal
    ? buildDealDetails({ deal, isConnected })
    : undefined;

  if (!isValid) {
    return <ErrorAlert className="my-16" message="Invalid deal address." />;
  }

  if (isError && error instanceof NotFoundError) {
    return <ErrorAlert className="my-16" message="Deal not found." />;
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      <SearcherBar className="py-10" />

      <div className="space-y-2">
        <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
          <DealIcon size={24} />
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
            <ErrorAlert message="An error occurred during deal details loading." />
          ) : (
            <DetailsTable details={dealDetails || {}} />
          ))}
        {currentTab === 1 && <DealTasksTable dealAddress={dealAddress} />}
      </div>
    </div>
  );
}
