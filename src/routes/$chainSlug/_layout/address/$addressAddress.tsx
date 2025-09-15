import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import AddressIcon from '@/components/icons/AddressIcon';
import { BackButton } from '@/components/ui/BackButton';
import { useTabParam } from '@/hooks/usePageParam';
import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { Tabs } from '@/modules/Tabs';
import { AddressBreadcrumbs } from '@/modules/addresses/address/AddressBreadcrumbs';
import { addressQuery } from '@/modules/addresses/address/addressQuery';
import { AddressAppsTable } from '@/modules/addresses/address/apps/AddressAppsTable';
import { buildAddressDetails } from '@/modules/addresses/address/buildAddressDetails';
import { buildAddressOverview } from '@/modules/addresses/address/buildAddressOverview';
import { AddressDatasetsTable } from '@/modules/addresses/address/datasets/AddressDatasetsTable';
import { AddressBeneficiaryDealsTable } from '@/modules/addresses/address/requests/beneficiaryDeals/AddressBeneficiaryDealsTable';
import { AddressRequestedDealsTable } from '@/modules/addresses/address/requests/requestedDeals/AddressRequestedDealsTable';
import { AddressRequestedTasksTable } from '@/modules/addresses/address/requests/requestedTasks/AddressRequestedTasksTable';
import { AddressWorkerpoolsTable } from '@/modules/addresses/address/workerpools/AddressWorkerpoolsTable';
import { AddressContributionTable } from '@/modules/addresses/address/workers/beneficiaryDeals/addressContributionTable';
import { SearcherBar } from '@/modules/search/SearcherBar';
import useUserStore from '@/stores/useUser.store';
import { NotFoundError } from '@/utils/NotFoundError';
import { isValidAddress } from '@/utils/addressOrIdCheck';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

export const Route = createFileRoute(
  '/$chainSlug/_layout/address/$addressAddress'
)({
  component: AddressRoute,
});

function useAddressData(address: string, chainId: number) {
  const isValid = isValidAddress(address);
  const queryKey = [chainId, 'address', address];
  const { data, isLoading, isRefetching, isError, error, errorUpdateCount } =
    useQuery({
      queryKey,
      enabled: !!chainId && isValid,
      queryFn: async () => {
        const result = await execute(addressQuery, chainId, {
          length: TABLE_LENGTH,
          address,
        });
        if (!result?.account) {
          throw new NotFoundError();
        }
        return result;
      },
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    });

  return {
    data: data?.account,
    isLoading,
    isRefetching,
    isError,
    error,
    hasPastError: isError || errorUpdateCount > 0,
    isValid,
  };
}

function AddressRoute() {
  const tabLabels = [
    'OVERVIEW',
    'REQUESTS',
    'WORKER',
    'APPS',
    'DATASETS',
    'WORKERPOOLS',
  ];
  const [currentTab, setCurrentTab] = useTabParam('addressTab', tabLabels, 0);
  const { chainId } = useUserStore();
  const { addressAddress } = Route.useParams();
  const {
    data: address,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
    isValid,
    error,
  } = useAddressData((addressAddress as string).toLowerCase(), chainId!);

  const addressDetails = address ? buildAddressDetails({ address }) : undefined;
  const addressOverview = address
    ? buildAddressOverview({ address })
    : undefined;

  const disabledTabs: number[] = [];
  const disabledReasons: Record<number, string> = {};

  // TODO like for other tab we have to check REQUESTS

  if (!address?.allContributions?.length) {
    disabledTabs.push(2);
    disabledReasons[2] = 'No contributions for this address.';
  }

  if (!address?.allApps?.length) {
    disabledTabs.push(3);
    disabledReasons[3] = 'No apps for this address.';
  }

  if (!address?.allDatasets?.length) {
    disabledTabs.push(4);
    disabledReasons[4] = 'No datasets for this address.';
  }

  if (!address?.allWorkerpools?.length) {
    disabledTabs.push(5);
    disabledReasons[5] = 'No workerpools for this address.';
  }

  if (!isValid) {
    return <ErrorAlert className="my-16" message="Invalid address." />;
  }

  if (isError && error instanceof NotFoundError) {
    return <ErrorAlert className="my-16" message="Address not found." />;
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      <div className="flex flex-col justify-between lg:flex-row">
        <SearcherBar className="py-6 lg:order-last lg:mr-0 lg:max-w-md lg:py-0" />
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
            <AddressIcon size={24} />
            Address details
            {!address && isError && (
              <span className="text-muted-foreground text-sm font-light">
                (outdated)
              </span>
            )}
            {(isLoading || isRefetching) && (
              <LoaderCircle className="animate-spin" />
            )}
          </h1>
          <div className="flex items-center gap-2">
            <BackButton />
            <AddressBreadcrumbs addressId={addressAddress} />
          </div>
        </div>
      </div>

      {hasPastError && !addressOverview ? (
        <ErrorAlert message="An error occurred during address details loading." />
      ) : (
        <DetailsTable details={addressOverview || {}} zebra={false} />
      )}

      <Tabs
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        tabLabels={tabLabels}
        disabledTabs={disabledTabs}
        disabledReasons={disabledReasons}
      />

      <div>
        {currentTab === 0 &&
          (hasPastError && !addressDetails ? (
            <ErrorAlert message="An error occurred during address details loading." />
          ) : (
            <DetailsTable details={addressDetails || {}} />
          ))}
        {currentTab === 1 && (
          <>
            <AddressRequestedTasksTable addressAddress={addressAddress} />
            <AddressRequestedDealsTable addressAddress={addressAddress} />
            <AddressBeneficiaryDealsTable addressAddress={addressAddress} />
          </>
        )}
        {currentTab === 2 && (
          <>
            <p className="mb-8">
              Contributions : {address?.allContributions.length}
            </p>
            <p className="mb-6">Score : {address?.score}</p>
            <AddressContributionTable addressAddress={addressAddress} />
          </>
        )}
        {currentTab === 3 && (
          <>
            <p className="mb-6">Deployed apps : {address?.allApps.length}</p>
            <AddressAppsTable addressAddress={addressAddress} />
          </>
        )}
        {currentTab === 4 && (
          <>
            <p className="mb-6">
              Deployed datasets : {address?.allDatasets.length}
            </p>
            <AddressDatasetsTable addressAddress={addressAddress} />
          </>
        )}
        {currentTab === 5 && (
          <>
            <p className="mb-6">
              Deployed workerpools : {address?.allWorkerpools.length}
            </p>
            <AddressWorkerpoolsTable addressAddress={addressAddress} />
          </>
        )}
      </div>
    </div>
  );
}
