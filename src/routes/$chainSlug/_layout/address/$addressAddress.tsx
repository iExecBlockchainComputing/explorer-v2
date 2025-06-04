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
import { buildAddressDetails } from '@/modules/addresses/address/buildAddressDetails';
import { buildAddressOverview } from '@/modules/addresses/address/buildAddressOverview';
import { AddressBeneficiaryDealsTable } from '@/modules/addresses/address/requests/beneficiaryDeals/AddressBeneficiaryDealsTable';
import { AddressRequestedDealsTable } from '@/modules/addresses/address/requests/requestedDeals/AddressRequestedDealsTable';
import { AddressRequestedTasksTable } from '@/modules/addresses/address/requests/requestedTasks/AddressRequestedTasksTable';
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
  console.log('AddressRequestedTasksTable rendered', addressAddress);
  const {
    data: address,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
  } = useAddressData(addressAddress, chainId);

  // if (!address) {
  //   return <p>Hum there is nothing here..</p>;
  // }
  const addressDetails = address ? buildAddressDetails({ address }) : undefined;

  const addressOverview = address
    ? buildAddressOverview({ address })
    : undefined;
  return (
    <div className="mt-8 flex flex-col gap-6">
      <SearcherBar className="py-10" />

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
      {hasPastError && !addressOverview ? (
        <ErrorAlert message="An error occurred during address details  loading." />
      ) : (
        <DetailsTable details={addressOverview} zebra={false} />
      )}
      <Tabs
        currentTab={currentTab}
        tabLabels={[
          'OVERVIEW',
          'REQUESTS',
          'WORKER',
          'APPS',
          'DATASETS',
          'WORKERPOOLS',
        ]}
        onTabChange={setCurrentTab}
      />
      <div>
        {currentTab === 0 &&
          (hasPastError && !addressDetails ? (
            <ErrorAlert message="An error occurred during address details  loading." />
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
      </div>
    </div>
  );
}
