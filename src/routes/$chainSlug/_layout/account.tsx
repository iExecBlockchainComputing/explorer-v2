import { API_COINGECKO_URL } from '@/config';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { formatRLC } from 'iexec/utils';
import { ArrowRight, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ChainLink } from '@/components/ChainLink';
import { Stepper } from '@/components/Stepper';
import IexecAccountIcon from '@/components/icons/IexecAccountIcon';
import WalletIcon from '@/components/icons/WalletIcon';
import { ChainSelector } from '@/components/navbar/ChainSelector';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/button';
import { getIExec } from '@/externals/iexecSdkClient';
import { useLoginLogout } from '@/hooks/useLoginLogout';
import { useTabParam } from '@/hooks/usePageParam';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { Tabs } from '@/modules/Tabs';
import { AccountBreadcrumbs } from '@/modules/account/AccountBreadcrumbs';
import { getTabs } from '@/modules/account/getTabs';
import useUserStore from '@/stores/useUser.store';
import { getChainFromId } from '@/utils/chain.utils';
import { rlcToNrlc } from '@/utils/rlcToNrlc';
import { truncateAddress } from '@/utils/truncateAddress';

export const Route = createFileRoute('/$chainSlug/_layout/account')({
  component: RouteComponent,
});

function RouteComponent() {
  const { address: userAddress, chainId } = useUserStore();
  const { login } = useLoginLogout();
  const [depositStep, setDepositStep] = useState(0);
  const [withdrawStep, setWithdrawStep] = useState(0);
  const [depositAmount, setDepositAmount] = useState('0');
  const [withdrawAmount, setWithdrawAmount] = useState('0');

  const { data: rlcPrice = 0 } = useQuery({
    queryKey: ['rlcPrice'],
    queryFn: async () => {
      const resp = await fetch(
        `${API_COINGECKO_URL}price?ids=iexec-rlc&vs_currencies=usd`
      );
      const json = await resp.json();
      return json['iexec-rlc']?.usd as number;
    },
    refetchInterval: 60_000,
  });

  const {
    data: walletBalance = 0,
    refetch: refetchWalletBalance,
    isError: walletBalanceIsError,
  } = useQuery({
    queryKey: [chainId, 'walletBalance', userAddress],
    queryFn: async () => {
      const iexec = await getIExec();
      const wallet = iexec.wallet;
      if (!wallet) throw new Error('Wallet is not initialized');
      if (!userAddress) throw new Error('userAddress is missing');
      const balance = await wallet.checkBalances(userAddress);
      return balance.nRLC.toNumber() as number;
    },
    enabled: !!userAddress,
  });

  const {
    data: accountStakedBalance = 0,
    refetch: refetchAccountStakedBalance,
    isError: accountStakedBalanceIsError,
  } = useQuery({
    queryKey: [chainId, 'accountStakedBalance', userAddress],
    queryFn: async () => {
      const iexec = await getIExec();
      const account = iexec.account;
      if (!account) throw new Error('Account is not initialized');
      if (!userAddress) throw new Error('userAddress is missing');
      const balance = await account.checkBalance(userAddress);
      return balance.stake.toNumber() as number;
    },
    enabled: !!userAddress,
  });

  const deposit = useMutation({
    mutationFn: async () => {
      if (depositAmount === '0') {
        throw new Error('You have nothing to deposit yet.');
      }
      const iexec = await getIExec();
      const account = iexec.account;
      if (!account) throw new Error('Account is not initialized');
      setDepositStep(1);
      await account.deposit(rlcToNrlc(depositAmount));
    },
    onSuccess: () => {
      refetchWalletBalance();
      refetchAccountStakedBalance();
      setDepositAmount('0');
      setDepositStep(2);
    },
    onError: () => {
      setDepositStep(0);
    },
  });

  const withdraw = useMutation({
    mutationFn: async () => {
      if (withdrawAmount === '0') {
        throw new Error('You have nothing to withdraw yet.');
      }
      const iexec = await getIExec();
      const account = iexec.account;
      if (!account) throw new Error('Account is not initialized');
      setWithdrawStep(1);
      await account.withdraw(rlcToNrlc(withdrawAmount));
    },
    onSuccess: () => {
      refetchAccountStakedBalance();
      refetchWalletBalance();
      setWithdrawAmount('0');
      setWithdrawStep(2);
    },
    onError: () => {
      setWithdrawStep(0);
    },
  });

  const tabs = getTabs({
    walletBalance,
    accountStakedBalance,
    depositAmount,
    setDepositAmount,
    setWithdrawAmount,
    withdrawAmount,
    deposit,
    withdraw,
    chainId: chainId!,
  });
  const tabLabels = tabs.map((tab) => tab.title);
  const [currentTab, setCurrentTab] = useTabParam('accountTab', tabLabels, 0);
  const getStepState = (
    tabIdx: number
  ): [number, React.Dispatch<React.SetStateAction<number>>] => {
    return tabIdx === 1
      ? [withdrawStep, setWithdrawStep]
      : [depositStep, setDepositStep];
  };
  const [currentStep] = getStepState(currentTab);
  const token = getChainFromId(chainId)?.tokenSymbol;

  useEffect(() => {
    const chain = getChainFromId(chainId);
    const bridge = chain?.bridge;

    if (!bridge && currentTab === 2) {
      setCurrentTab(1);
    }
  }, [chainId]);

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

  return (
    <div className="mt-8 flex flex-col gap-10">
      <div className="flex items-center gap-2">
        <BackButton />
        <AccountBreadcrumbs />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          IExec Wallet Manager
        </h1>
        <span>{truncateAddress(userAddress!, { startLen: 8, endLen: 8 })}</span>
        <ChainSelector />
      </div>

      <div className="flex flex-col items-center justify-center gap-x-6 gap-y-4 md:flex-row">
        <div
          className={cn(
            'border-grey-500 w-full max-w-80 space-y-6 rounded-3xl border px-10 py-6 duration-300',
            currentTab === 0 && 'border-primary'
          )}
        >
          <p className="font-anybody flex items-center gap-4 font-extrabold">
            <span className="bg-primary/10 text-primary rounded-lg p-2">
              <WalletIcon size={20} />
            </span>
            Your Wallet
          </p>
          <div className="text-center text-lg font-bold md:text-right">
            {accountStakedBalanceIsError ? (
              <ErrorAlert message={`Fail to get wallet ${token}`} />
            ) : (
              <>
                {Number(formatRLC(walletBalance)).toLocaleString('en', {
                  maximumFractionDigits: 9,
                })}{' '}
                {token}
              </>
            )}
            <br />
            {walletBalance &&
              Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 2,
              }).format(Number(formatRLC(walletBalance)) * rlcPrice)}
          </div>
        </div>
        <ArrowRight
          className={cn(
            'text-primary size-8 flex-none rotate-90 duration-300 md:rotate-0',
            currentTab === 1
              ? '-rotate-90 md:rotate-180'
              : currentTab === 2 && 'opacity-0'
          )}
        />
        <div
          className={cn(
            'border-grey-500 w-full max-w-80 space-y-6 rounded-3xl border px-10 py-6 duration-300',
            currentTab === 1 && 'border-primary'
          )}
        >
          <p className="font-anybody flex items-center gap-4 font-extrabold">
            <span className="bg-primary/10 text-primary rounded-lg p-2">
              <IexecAccountIcon size={20} />
            </span>
            Your iExec Account
          </p>
          <div className="text-center text-lg font-bold md:text-right">
            {walletBalanceIsError ? (
              <ErrorAlert message={`Fail to get iExec account ${token}`} />
            ) : (
              <>
                {Number(formatRLC(accountStakedBalance)).toLocaleString('en', {
                  maximumFractionDigits: 9,
                })}{' '}
                {token}
              </>
            )}
            <br />
            {accountStakedBalance &&
              Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 2,
              }).format(Number(formatRLC(accountStakedBalance)) * rlcPrice)}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex w-full max-w-5xl flex-col gap-6">
        <Tabs
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          tabLabels={tabLabels}
        />

        {/* Mobile only previous steps */}
        {tabs[currentTab]?.steps && (
          <div className="space-y-6 md:hidden">
            {tabs[currentTab].steps.slice(0, currentStep).map((step, index) => (
              <div key={index}>
                <div className="inline-flex items-center">
                  <span className="bg-primary mr-4 inline-flex size-8 items-center justify-center rounded-full font-sans font-normal text-black">
                    <Check size={16} />
                  </span>
                  <span className="font-bold">{step.title}</span>
                </div>
                <span className="bg-primary ml-4 block h-10 w-px -translate-x-full translate-y-3 scale-y-125"></span>
              </div>
            ))}
          </div>
        )}

        <div className="md:border-grey-500 space-y-6 md:rounded-3xl md:border md:p-10">
          <div className="space-y-4 md:space-y-1.5">
            <h2 className="md:font-anybody font-sans font-bold">
              <span className="mr-4 inline-flex size-8 items-center justify-center rounded-full bg-white font-sans font-normal text-black md:hidden">
                {currentStep + 1}
              </span>
              {tabs[currentTab]?.longTitle}
            </h2>
            {currentStep === 0 && (
              <p className="md:hidden">{tabs[currentTab]?.desc}</p>
            )}
            <p className="hidden md:inline-block">{tabs[currentTab]?.desc}</p>
          </div>

          {tabs[currentTab]?.steps && (
            <>
              <Stepper
                classname="p-6 hidden md:grid"
                currentStep={currentStep}
                steps={tabs[currentTab].steps.map((s) => s.title)}
              />
              {tabs[currentTab].steps[currentStep]?.content}
            </>
          )}
          {tabs[currentTab]?.content && tabs[currentTab].content}
        </div>

        {/* Mobile only next steps */}
        {tabs[currentTab]?.steps && (
          <div className="space-y-2 md:hidden">
            {tabs[currentTab].steps
              .map((step, index) => ({ step, index }))
              .filter(({ index }) => index > currentStep)
              .map(({ step, index }, arrayIndex, arr) => (
                <div key={index}>
                  <div>
                    <span className="bg-grey-700 mr-4 inline-flex size-8 items-center justify-center rounded-full font-sans font-normal text-white">
                      {index + 1}
                    </span>
                    <span className="text-grey-500 font-bold">
                      {step.title}
                    </span>
                  </div>
                  {arrayIndex < arr.length - 1 && (
                    <span className="bg-grey-600 mt-2 ml-4 block h-10 w-px -translate-x-full"></span>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
