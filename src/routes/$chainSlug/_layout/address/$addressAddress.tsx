import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
import AddressIcon from '@/components/icons/AddressIcon';
import { BackButton } from '@/components/ui/BackButton';
import { useTabParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { AddressBreadcrumbs } from '@/modules/addresses/address/AddressBreadcrumbs';
import { AddressTabsContent } from '@/modules/addresses/address/AddressTabsContent';
import { addressQuery } from '@/modules/addresses/address/addressQuery';
import { buildAddressDetails } from '@/modules/addresses/address/buildAddressDetails';
import { buildAddressOverview } from '@/modules/addresses/address/buildAddressOverview';
import { SearcherBar } from '@/modules/search/SearcherBar';
import useUserStore from '@/stores/useUser.store';
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
          return {
            account: {
              address: address,
              allApps: [],
              allContributions: [],
              allDatasets: [],
              allDealBeneficiary: [],
              allDealRequester: [],
              allWorkerpools: [],
              locked: '0',
              score: '0',
              staked: '0',
            },
          };
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
    'RECEIVED ACCESS',
    'GRANTED ACCESS',
  ];
  const [currentTab, setCurrentTab] = useTabParam('addressTab', tabLabels, 0);
  const { chainId, address: userAddress } = useUserStore();
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

  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const { chainSlug } = Route.useParams();
  const fromMyActivity = search?.['from'] === 'my_activity';

  useEffect(() => {
    if (
      fromMyActivity &&
      userAddress &&
      addressAddress?.toLowerCase() !== userAddress?.toLowerCase()
    ) {
      navigate({
        to: `/${chainSlug}/address/${userAddress}`,
        search: (prev: Record<string, unknown>) => ({
          ...prev,
          from: 'my_activity',
        }),
        replace: true,
        resetScroll: false,
      });
    }
  }, [userAddress, addressAddress, fromMyActivity, navigate, chainSlug]);

  const addressDetails = address ? buildAddressDetails({ address }) : undefined;
  const addressOverview = address
    ? buildAddressOverview({ address })
    : undefined;

  if (!isValid) {
    return <ErrorAlert className="my-16" message="Invalid address." />;
  }

  if (isError && error && address === null) {
    return (
      <ErrorAlert className="my-16" message="No data found for this address." />
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      <div className="mt-6 flex flex-col justify-between lg:flex-row">
        <SearcherBar className="py-6 lg:order-last lg:mr-0 lg:max-w-md lg:py-0 xl:max-w-xl" />
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

      <AddressTabsContent
        addressAddress={addressAddress}
        address={address as any}
        addressDetails={addressDetails}
        addressOverview={addressOverview}
        hasPastError={hasPastError}
        isLoading={isLoading}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
    </div>
  );
}
