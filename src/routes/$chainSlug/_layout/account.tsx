import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import React from 'react';
import { ChainLink } from '@/components/ChainLink';
import avatarStyles from '@/components/navbar/profile.module.css';
import { Button } from '@/components/ui/button';
import { useLoginLogout } from '@/hooks/useLoginLogout';
import { useTabParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { Faucet } from '@/modules/account/Faucet';
import { ManageIexecAccount } from '@/modules/account/ManageIexecAccount_tmp';
import { AddressTabsContent } from '@/modules/addresses/address/AddressTabsContent';
import { addressQuery } from '@/modules/addresses/address/addressQuery';
import { buildAddressDetails } from '@/modules/addresses/address/buildAddressDetails';
import { buildAddressOverview } from '@/modules/addresses/address/buildAddressOverview';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';
import { getAvatarVisualNumber } from '@/utils/getAvatarVisualNumber';
import { truncateAddress } from '@/utils/truncateAddress';

export const Route = createFileRoute('/$chainSlug/_layout/account')({
  component: RouteComponent,
});

function RouteComponent() {
  const { logout, login } = useLoginLogout();
  const { address: userAddress, chainId } = useUserStore();

  // Nested wallet activity panel uses address tabs
  function WalletActivityPanel() {
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
      return (
        <div className="mt-20 flex flex-col items-center justify-center gap-6 text-center">
          <h1 className="text-2xl font-bold">You are not connected</h1>
          <p className="text-muted-foreground max-w-sm">
            To access the iExec Wallet Manager, please connect your wallet.
          </p>
          <div className="flex gap-4">
            <Button variant="outline">
              <ChainLink to="/">Go back home</ChainLink>
            </Button>
            <Button onClick={login}>Connect wallet</Button>
          </div>
        </div>
      );
    }
    if (isError && error && !account) {
      return <ErrorAlert message="No data found for this address." />;
    }
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Wallet Activity</h1>
        <AddressTabsContent
          addressAddress={userAddress}
          address={account ?? undefined}
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

  const avatarVisualBg = getAvatarVisualNumber({
    address: userAddress,
  });

  const tabs = [
    { titleText: 'Faucet', label: <>Faucet</>, component: Faucet },
    {
      titleText: 'Account',
      label: <>Account</>,
      component: ManageIexecAccount,
    },

    {
      titleText: 'Wallet Activity',
      label: <>Wallet Activity</>,
      component: WalletActivityPanel,
    },
    {
      titleText: 'Log out',
      label: (
        <>
          <span className="hidden sm:inline">Log out</span>
          <span className="inline-block">
            <LogOut size={20} />
          </span>
        </>
      ),
      action: logout,
    },
  ];

  const tabLabels = tabs.map((tab) => tab.titleText);
  const [currentTab, setCurrentTab] = useTabParam('accountTab', tabLabels, 0);

  const handleTabClick = (tabIndex: number) => {
    const tab = tabs[tabIndex];
    if (tab.action) {
      tab.action();
    } else {
      setCurrentTab(tabIndex);
    }
  };

  return (
    <div className="mt-8 grid gap-4 md:flex md:gap-10 lg:gap-20">
      {userAddress && (
        <div className="top-4 h-fit space-y-4 self-start overflow-x-auto rounded-2xl border px-3 py-4 md:sticky md:top-8 md:max-w-56 md:px-6 md:py-8">
          <div className="sticky left-0 inline-flex items-center gap-1">
            <div
              className={cn(
                avatarStyles[avatarVisualBg],
                'bg-background relative z-10 size-5 rounded-full bg-cover'
              )}
            />
            <span className="text-primary text-md">
              {truncateAddress(userAddress)}
            </span>
          </div>
          <div className="flex justify-between gap-2 md:flex-col md:gap-4">
            {tabs.map((tab, index) => (
              <button
                key={tab.titleText}
                onClick={() => handleTabClick(index)}
                className={cn(
                  'text-muted-foreground flex items-center gap-2 rounded-md bg-transparent px-2 py-2 text-left whitespace-nowrap duration-200 md:px-4',
                  index === currentTab && 'bg-muted text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="min-w-0 flex-1 overflow-x-auto">
        {tabs[currentTab].component
          ? React.createElement(tabs[currentTab].component)
          : null}
      </div>
    </div>
  );
}
