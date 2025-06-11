import { SUPPORTED_CHAINS } from '@/config';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Stepper } from '@/components/Stepper';
import { ChainSelector } from '@/components/navbar/ChainSelector';
import { Tabs } from '@/modules/Tabs';
import { AccountBreadcrumbs } from '@/modules/account/AccountBreadcrumbs';
import { getTabs } from '@/modules/account/getTabs';
import useUserStore from '@/stores/useUser.store';
import { truncateAddress } from '@/utils/truncateAddress';

export const Route = createFileRoute('/$chainSlug/_layout/account')({
  component: RouteComponent,
});

function RouteComponent() {
  const { address, chainId } = useUserStore();
  const [currentTab, setCurrentTab] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const disabledTabs: number[] = [];
  const disabledReasons: Record<number, string> = {};

  if (chainId !== SUPPORTED_CHAINS[0].id) {
    disabledTabs.push(2);
    disabledReasons[2] = 'The selected chain has no bridge.';
  }

  const deposit = useMutation({
    mutationFn: async () => {},
    onSuccess: () => setCurrentStep(2),
  });

  const withdraw = useMutation({
    mutationFn: async () => {},
    onSuccess: () => setCurrentStep(2),
  });

  const tabs = getTabs({ deposit, withdraw, chainId });

  useEffect(() => {
    if (currentTab === tabs.length - 1 && chainId !== SUPPORTED_CHAINS[0].id) {
      setCurrentTab(currentTab - 1);
    }
  }, [chainId, currentTab, tabs.length]);

  return (
    <div className="mt-8 flex flex-col gap-10">
      <AccountBreadcrumbs />
      <div className="flex flex-col items-center gap-2">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          IExec Wallet Manager
        </h1>
        <span>{truncateAddress(address, { startLen: 8, endLen: 8 })}</span>
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
            0 xRLC
            <br />
            $0.00
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
            0 xRLC
            <br />
            $0.00
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
            <h2>{tabs[currentTab].longTitle}</h2>
            <p>{tabs[currentTab].desc}</p>
          </div>
          {tabs[currentTab].steps && (
            <>
              <Stepper
                classname="p-6"
                currentStep={currentStep}
                steps={tabs[currentTab].steps.map((s) => s.title)}
              />
              {tabs[currentTab].steps[currentStep]?.content}
            </>
          )}
          {tabs[currentTab].content && tabs[currentTab].content}
        </div>
      </div>
    </div>
  );
}
