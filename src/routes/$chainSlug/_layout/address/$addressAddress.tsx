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
import useUserStore from '@/stores/useUser.store';

export const Route = createFileRoute(
  '/$chainSlug/_layout/address/$addressAddress'
)({
  component: AddressRoute,
});

function useAddressData(address: string, chainId: number) {
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey: ['address', address],
      queryFn: () =>
        execute(addressQuery, chainId, {
          length: TABLE_LENGTH,
          address,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: keepPreviousData,
    }
  );

  return {
    data: data?.account,
    isLoading,
    isRefetching,
    isError,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

function AddressRoute() {
  const [currentTab, setCurrentTab] = useState(0);
  const { chainId } = useUserStore();
  const { addressAddress } = Route.useParams();
  const {
    data: address,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
  } = useAddressData(addressAddress, chainId!);

  const addressDetails = address ? buildAddressDetails({ address }) : undefined;
  const addressOverview = address
    ? buildAddressOverview({ address })
    : undefined;

  const disabledTabs: number[] = [];
  const disabledReasons: Record<number, string> = {};

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

  return (
    <div className="mt-8 flex flex-col gap-6">
      <SearcherBar className="py-10" />

      <div className="space-y-2">
        <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
          <Box size="20" />
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
        <AddressBreadcrumbs addressId={addressAddress} />
      </div>

      {hasPastError && !addressOverview ? (
        <ErrorAlert message="An error occurred during address details loading." />
      ) : (
        <DetailsTable details={addressOverview} zebra={false} />
      )}

      <Tabs
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        tabLabels={[
          'OVERVIEW',
          'REQUESTS',
          'WORKER',
          'APPS',
          'DATASETS',
          'WORKERPOOLS',
        ]}
        disabledTabs={disabledTabs}
        disabledReasons={disabledReasons}
      />

      <div>
        {currentTab === 0 &&
          (hasPastError && !addressDetails ? (
            <ErrorAlert message="An error occurred during address details loading." />
          ) : (
            <DetailsTable details={addressDetails} />
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
