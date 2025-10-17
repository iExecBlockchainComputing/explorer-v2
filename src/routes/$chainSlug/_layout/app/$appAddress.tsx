import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import AppIcon from '@/components/icons/AppIcon';
import { BackButton } from '@/components/ui/BackButton';
import { useTabParam } from '@/hooks/usePageParam';
import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { Tabs } from '@/modules/Tabs';
import { AppAccessTable } from '@/modules/apps/app/AppAccessTable';
import { AppBreadcrumbs } from '@/modules/apps/app/AppBreadcrumbs';
import { AppDealsTable } from '@/modules/apps/app/AppDealsTable';
import { appQuery } from '@/modules/apps/app/appQuery';
import { buildAppDetails } from '@/modules/apps/app/buildAppDetails';
import { SearcherBar } from '@/modules/search/SearcherBar';
import useUserStore from '@/stores/useUser.store';
import { NotFoundError } from '@/utils/NotFoundError';
import { isValidAddress } from '@/utils/addressOrIdCheck';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

export const Route = createFileRoute('/$chainSlug/_layout/app/$appAddress')({
  component: AppsRoute,
});

function useAppData(appAddress: string, chainId: number) {
  const isValid = isValidAddress(appAddress);
  const queryKey = [chainId, 'app', appAddress];
  const { data, isLoading, isRefetching, isError, error, errorUpdateCount } =
    useQuery({
      queryKey,
      enabled: !!chainId && isValid,
      queryFn: async () => {
        const result = await execute(appQuery, chainId, {
          length: TABLE_LENGTH,
          appAddress,
          appAddressString: appAddress,
        });
        if (!result?.app) {
          throw new NotFoundError();
        }
        return result;
      },
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    });

  return {
    data: data?.app,
    isLoading,
    isRefetching,
    isError,
    error,
    hasPastError: isError || errorUpdateCount > 0,
    isValid,
  };
}

function AppsRoute() {
  const tabLabels = ['DETAILS', 'DEALS', 'ACCESS'];
  const [currentTab, setCurrentTab] = useTabParam('appTab', tabLabels, 0);
  const { chainId } = useUserStore();
  const { appAddress } = Route.useParams();
  const {
    data: app,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
    isValid,
    error,
  } = useAppData((appAddress as string).toLowerCase(), chainId!);

  const [isLoadingChild, setIsLoadingChild] = useState(false);
  const [isOutdatedChild, setIsOutdatedChild] = useState(false);

  const appDetails = app ? buildAppDetails({ app }) : undefined;

  if (!isValid) {
    return <ErrorAlert className="my-16" message="Invalid app address." />;
  }

  if (isError && error instanceof NotFoundError) {
    return <ErrorAlert className="my-16" message="App not found." />;
  }

  const showOutdated = app && (isError || isOutdatedChild);
  const showLoading = isLoading || isRefetching || isLoadingChild;

  return (
    <div className="mt-8 flex flex-col gap-6">
      <div className="mt-6 flex flex-col justify-between lg:flex-row">
        <SearcherBar className="py-6 lg:order-last lg:mr-0 lg:max-w-md lg:py-0 xl:max-w-xl" />
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 text-2xl font-extrabold">
            <AppIcon size={24} />
            App details
            {showOutdated && (
              <span className="text-muted-foreground text-sm font-light">
                (outdated)
              </span>
            )}
            {showLoading && <LoaderCircle className="animate-spin" />}
          </h1>
          <div className="flex items-center gap-2">
            <BackButton />
            <AppBreadcrumbs appId={appAddress} />
          </div>
        </div>
      </div>

      <Tabs
        currentTab={currentTab}
        tabLabels={tabLabels}
        onTabChange={setCurrentTab}
      />
      {currentTab === 0 &&
        (hasPastError && !appDetails ? (
          <ErrorAlert message="An error occurred during app details loading." />
        ) : (
          <DetailsTable details={appDetails || {}} zebra={false} />
        ))}
      {currentTab === 1 && (
        <AppDealsTable
          appAddress={appAddress}
          setLoading={setIsLoadingChild}
          setOutdated={setIsOutdatedChild}
        />
      )}
      {currentTab === 2 && (
        <AppAccessTable
          appAddress={appAddress}
          setLoading={setIsLoadingChild}
          setOutdated={setIsOutdatedChild}
        />
      )}
    </div>
  );
}
