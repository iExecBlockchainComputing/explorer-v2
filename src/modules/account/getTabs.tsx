import { DefaultError } from '@tanstack/query-core';
import { UseMutationResult } from '@tanstack/react-query';
import { formatRLC } from 'iexec/utils';
import { LoaderCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getChainFromId } from '@/utils/chain.utils';

interface TabsProps {
  deposit: UseMutationResult<void, DefaultError, void>;
  withdraw: UseMutationResult<void, DefaultError, void>;
  chainId: number;
  totalToDeposit: number;
  totalToWithdraw: number;
  depositAmount: string;
  withdrawAmount: string;
  setDepositAmount: (amount: string) => void;
  setWithdrawAmount: (amount: string) => void;
}

export function getTabs({
  deposit,
  withdraw,
  chainId,
  totalToDeposit,
  totalToWithdraw,
  depositAmount,
  withdrawAmount,
  setDepositAmount,
  setWithdrawAmount,
}: TabsProps) {
  const maxToWithdraw = Number(formatRLC(totalToWithdraw));
  const maxToDeposit = Number(formatRLC(totalToDeposit));
  const token = getChainFromId(chainId)?.tokenSymbol;

  return [
    {
      title: `DEPOSIT ${token}`,
      longTitle: `Deposit ${token} to your Account`,
      desc: 'Top up your iExec account with your wallet to use iExec platform',
      steps: [
        {
          title: 'Choose the amount to deposit',
          content: (
            <form
              className="flex flex-col justify-center gap-6 md:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                deposit.mutate();
              }}
            >
              <div className="relative">
                <Input
                  className="max-w-80 min-w-full pr-11"
                  type="number"
                  required
                  max={maxToDeposit}
                  value={depositAmount?.toString()}
                  onChange={(e) => {
                    setDepositAmount(e.target.value);
                  }}
                />
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  className="absolute inset-y-1.5 right-1"
                  onClick={() => {
                    setDepositAmount(maxToDeposit.toString());
                  }}
                >
                  Max
                </Button>
              </div>
              <Button
                type="submit"
                disabled={
                  depositAmount === '0' || Number(depositAmount) > maxToDeposit
                }
              >
                Deposit
              </Button>
            </form>
          ),
        },
        {
          title: 'Sign deposit tx',
          content: (
            <span className="mx-auto flex w-full justify-center gap-2">
              <LoaderCircle className="text-primary animate-spin" />
              Awaiting transaction signature
            </span>
          ),
        },
        {
          title: `${token} deposit`,
          content: (
            <span className="mx-auto flex w-full justify-center gap-2">
              Deposit successful
              <CheckCircle className="text-primary" />
            </span>
          ),
        },
      ],
    },
    {
      title: `WITHDRAW ${token}`,
      longTitle: `Withdraw ${token} to your Wallet`,
      desc: 'Withdraw your profits from your iExec Account',
      steps: [
        {
          title: 'Choose the amount to withdraw',
          content: (
            <form
              className="flex flex-col justify-center gap-6 md:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                withdraw.mutate();
              }}
            >
              <div className="relative">
                <Input
                  className="w-full min-w-80 pr-11"
                  type="number"
                  required
                  max={maxToWithdraw}
                  value={withdrawAmount?.toString()}
                  onChange={(e) => {
                    setWithdrawAmount(e.target.value);
                  }}
                />
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  className="absolute inset-y-1.5 right-1"
                  onClick={() => {
                    setWithdrawAmount(maxToWithdraw.toString());
                  }}
                >
                  Max
                </Button>
              </div>
              <Button
                type="submit"
                disabled={
                  withdrawAmount === '0' ||
                  Number(withdrawAmount) > maxToWithdraw
                }
              >
                Withdraw
              </Button>
            </form>
          ),
        },
        {
          title: 'Sign withdraw tx',
          content: (
            <span className="mx-auto flex w-full justify-center gap-2">
              <LoaderCircle className="text-primary animate-spin" />
              Awaiting transaction signature
            </span>
          ),
        },
        {
          title: `${token} withdrawn`,
          content: (
            <span className="mx-auto flex w-full justify-center gap-2">
              Withdraw successful
              <CheckCircle className="text-primary" />
            </span>
          ),
        },
      ],
    },
    {
      title: `BRIDGE ${token}`,
      longTitle: `Bridge your ${token} between chains`,
      desc: getChainFromId(chainId)?.bridgeInformation,
      content: (
        <Button asChild>
          <a
            href={getChainFromId(chainId)?.bridge}
            rel="noreferrer"
            target="_blank"
          >
            Bridge <ExternalLink />
          </a>
        </Button>
      ),
    },
  ].filter((tab, index) => {
    const chain = getChainFromId(chainId);
    if (index === 2 && (!chain || !chain.bridge)) return false;
    return true;
  });
}
