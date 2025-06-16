import { SUPPORTED_CHAINS } from '@/config';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { formatRLC } from 'iexec/utils';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Stepper } from '@/components/Stepper';
import { ChainSelector } from '@/components/navbar/ChainSelector';
import { getIExec } from '@/externals/iexecSdkClient';
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
  const [currentTab, setCurrentTab] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [depositAmount, setDepositAmount] = useState('0');
  const [withdrawAmount, setWithdrawAmount] = useState('0');

  const disabledTabs: number[] = [];
  const disabledReasons: Record<number, string> = {};

  if (chainId !== SUPPORTED_CHAINS[0].id) {
    disabledTabs.push(2);
    disabledReasons[2] = 'The selected chain has no bridge.';
  }

  const { data: rlcPrice = 0 } = useQuery({
    queryKey: ['rlcPrice'],
    queryFn: async () => {
      const resp = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=iexec-rlc&vs_currencies=usd'
      );
      const json = await resp.json();
      return json['iexec-rlc']?.usd as number;
    },
    refetchInterval: 60_000,
  });

  const {
    data: totalToDeposit = 0,
    refetch: refetchTotalToDeposit,
    isError: totalToDepositIsError,
  } = useQuery({
    queryKey: [chainId, 'totalToDeposit', userAddress],
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
    data: totalToWithdraw = 0,
    refetch: refetchTotalToWithdraw,
    isError: totalToWithdrawIsError,
  } = useQuery({
    queryKey: [chainId, 'totalToWithdraw', userAddress],
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
      if (totalToDeposit === 0) {
        throw new Error('You have nothing to deposit yet.');
      }
      const iexec = await getIExec();
      const account = iexec.account;
      if (!account) throw new Error('Account is not initialized');
      setCurrentStep(1);
      await account.deposit(rlcToNrlc(depositAmount));
    },
    onSuccess: () => {
      refetchTotalToDeposit();
      setDepositAmount('0');
      setCurrentStep(2);
    },
    onError: () => {
      setCurrentStep(0);
    },
  });

  const withdraw = useMutation({
    mutationFn: async () => {
      if (totalToWithdraw === 0) {
        throw new Error('You have nothing to withdraw yet.');
      }
      const iexec = await getIExec();
      const account = iexec.account;
      if (!account) throw new Error('Account is not initialized');
      setCurrentStep(1);
      await account.withdraw(rlcToNrlc(withdrawAmount));
    },
    onSuccess: () => {
      refetchTotalToWithdraw();
      setWithdrawAmount('0');
      setCurrentStep(2);
    },
    onError: () => {
      setCurrentStep(0);
    },
  });

  const tabs = getTabs({
    totalToDeposit,
    totalToWithdraw,
    depositAmount,
    setDepositAmount,
    setWithdrawAmount,
    withdrawAmount,
    deposit,
    withdraw,
    chainId,
  });

  useEffect(() => {
    const chain = getChainFromId(chainId);
    const bridge = chain?.bridge;

    if (!bridge && currentTab === 2) {
      setCurrentTab(1);
    }
  }, [chainId]);

  return (
    <div className="mt-8 flex flex-col gap-10">
      <AccountBreadcrumbs />
      <div className="flex flex-col items-center gap-2">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          IExec Wallet Manager
        </h1>
        <span>{truncateAddress(userAddress, { startLen: 8, endLen: 8 })}</span>
        <ChainSelector />
      </div>

      <div className="flex items-center justify-center gap-6">
        <div
          className={cn(
            'border-grey-500 min-w-80 space-y-6 rounded-3xl border px-10 py-6 duration-300',
            currentTab === 0 && 'border-primary'
          )}
        >
          <p>Your wallet</p>
          <div className="text-right">
            {Number(formatRLC(totalToDeposit)).toLocaleString('en', {
              maximumFractionDigits: 8,
            })}{' '}
            xRLC
            <br />
            {Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 2,
            }).format(Number(formatRLC(totalToDeposit)) * rlcPrice)}
          </div>
        </div>
        <ArrowRight
          className={cn(
            'text-primary size-8 duration-300',
            currentTab === 1 ? 'rotate-180' : currentTab === 2 && 'opacity-0'
          )}
        />
        <div
          className={cn(
            'border-grey-500 min-w-80 space-y-6 rounded-3xl border px-10 py-6 duration-300',
            currentTab === 1 && 'border-primary'
          )}
        >
          <p>Your iExec Account</p>
          <div className="text-right">
            {Number(formatRLC(totalToWithdraw)).toLocaleString('en', {
              maximumFractionDigits: 8,
            })}{' '}
            xRLC
            <br />
            {Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 2,
            }).format(Number(formatRLC(totalToWithdraw)) * rlcPrice)}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 w-full max-w-5xl space-y-6">
        <Tabs
          currentTab={currentTab}
          onTabChange={(tab) => {
            setCurrentTab(tab);
            setCurrentStep(0);
          }}
          tabLabels={tabs.map((tab) => tab.title)}
          disabledTabs={disabledTabs}
          disabledReasons={disabledReasons}
        />

        <div className="border-grey-500 space-y-6 rounded-3xl border p-10">
          <div className="space-y-1.5">
            <h2>{tabs[currentTab]?.longTitle}</h2>
            <p>{tabs[currentTab]?.desc}</p>
          </div>
          {tabs[currentTab]?.steps && (
            <>
              <Stepper
                classname="p-6"
                currentStep={currentStep}
                steps={tabs[currentTab].steps.map((s) => s.title)}
              />
              {tabs[currentTab].steps[currentStep]?.content}
            </>
          )}
          {tabs[currentTab]?.content && tabs[currentTab].content}
        </div>
      </div>
    </div>
  );
}
