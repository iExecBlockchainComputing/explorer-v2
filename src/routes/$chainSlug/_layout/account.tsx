import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import React from 'react';
import { useLoginLogout } from '@/hooks/useLoginLogout';
import { useTabParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { Faucet } from '@/modules/account/Faucet';
import { ManageIexecAccount } from '@/modules/account/ManageIexecAccount';
import { AddressTabsContent } from '@/modules/addresses/address/AddressTabsContent';
import { addressQuery } from '@/modules/addresses/address/addressQuery';
import { buildAddressDetails } from '@/modules/addresses/address/buildAddressDetails';
import { buildAddressOverview } from '@/modules/addresses/address/buildAddressOverview';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

export const Route = createFileRoute('/$chainSlug/_layout/account')({
  component: RouteComponent,
});

function RouteComponent() {
  const { logout } = useLoginLogout();

  // Nested wallet activity panel uses address tabs
  function WalletActivityPanel() {
    const { address: userAddress, chainId } = useUserStore();
    const lowerAddress = userAddress?.toLowerCase();
    const enabled = !!chainId && !!lowerAddress;
    const queryKey = [chainId, 'wallet-activity', lowerAddress];
    const { data, isLoading, isError, error, errorUpdateCount } = useQuery({
      queryKey,
      enabled,
      queryFn: async () => {
        const result = await execute(addressQuery, chainId!, {
          length: TABLE_LENGTH,
          address: lowerAddress!,
        });
        if (!result?.account) {
          return {
            account: {
              address: lowerAddress!,
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

    const account = data?.account;
    const hasPastError = isError || errorUpdateCount > 0;
    const addressDetails = account
      ? buildAddressDetails({ address: account })
      : undefined;
    const addressOverview = account
      ? buildAddressOverview({ address: account })
      : undefined;
    const [addressCurrentTab, setAddressCurrentTab] = useTabParam(
      'walletActivityAddressTab',
      [
        'OVERVIEW',
        'REQUESTS',
        'WORKER',
        'APPS',
        'DATASETS',
        'WORKERPOOLS',
        'RECEIVED ACCESS',
        'GRANTED ACCESS',
      ],
      0
    );

    if (!userAddress) {
      return <ErrorAlert message="Connect wallet to view activity." />;
    }
    if (isError && error && !account) {
      return <ErrorAlert message="No data found for this address." />;
    }
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Wallet Activity</h1>
        <AddressTabsContent
          addressAddress={userAddress}
          address={account}
          addressDetails={addressDetails}
          addressOverview={addressOverview}
          hasPastError={hasPastError}
          isLoading={isLoading}
          currentTab={addressCurrentTab}
          setCurrentTab={setAddressCurrentTab}
        />
      </div>
    );
  }

  const tabs = [
    { title: 'Faucet', component: Faucet },
    { title: 'Manage iExec Account', component: ManageIexecAccount },
    { title: 'Wallet Activity', component: WalletActivityPanel },
    { title: 'Log out', icon: <LogOut size={20} />, action: logout },
  ];

  const tabLabels = tabs.map((tab) => tab.title);
  const [currentTab, setCurrentTab] = useTabParam('accountTab', tabLabels, 0);

  const handleTabClick = (tab) => {
    if (tab.action) {
      tab.action();
    } else {
      setCurrentTab(tabs.indexOf(tab));
    }
  };

  return (
    <div className="mt-8 flex gap-28">
      <div className="flex h-fit max-w-56 flex-col gap-4 rounded-2xl border px-6 py-8">
        {tabs.map((tab, index) => (
          <button
            key={tab.title}
            onClick={() => handleTabClick(tab)}
            className={cn(
              'text-muted-foreground flex items-center gap-2 rounded-md bg-transparent px-4 py-2 text-left duration-200',
              index === currentTab && 'bg-muted'
            )}
          >
            {tab.title}{' '}
            {tab.icon && <span className="inline-block">{tab.icon}</span>}
          </button>
        ))}
      </div>
      <div className="min-w-0 flex-1 overflow-x-auto">
        {tabs[currentTab].component
          ? React.createElement(tabs[currentTab].component)
          : null}
      </div>
    </div>
  );
}
