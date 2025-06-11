import { SUPPORTED_CHAINS } from '@/config';
import { DefaultError } from '@tanstack/query-core';
import { UseMutationResult } from '@tanstack/react-query';
import { LoaderCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TabsProps {
  deposit: UseMutationResult<void, DefaultError, void>;
  withdraw: UseMutationResult<void, DefaultError, void>;
  chainId: number;
}

export function getTabs({ deposit, withdraw, chainId }: TabsProps) {
  return [
    {
      title: 'DEPOSIT xRLC',
      longTitle: 'Deposit xRLC to your Account',
      desc: 'Top up your iExec account with your wallet to use iExec platform',
      steps: [
        {
          title: 'Choose the amount to deposit',
          content: (
            <form
              className="flex justify-center gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                deposit.mutate();
              }}
            >
              <div className="relative">
                <Input className="w-full max-w-80" max={10} />
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  className="absolute inset-y-1.5 right-1"
                >
                  Max
                </Button>
              </div>
              <Button type="submit">Deposit</Button>
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
          title: 'xRLC deposit',
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
      title: 'WITHDRAW xRLC',
      longTitle: 'Withdraw xRLC to your Wallet',
      desc: 'Withdraw your profits from your iExec Account',
      steps: [
        {
          title: 'Choose the amount to withdraw',
          content: (
            <form
              className="flex justify-center gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                withdraw.mutate();
              }}
            >
              <div className="relative">
                <Input className="w-full max-w-80" max={10} />
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  className="absolute inset-y-1.5 right-1"
                >
                  Max
                </Button>
              </div>
              <Button type="submit">Withdraw</Button>
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
          title: 'xRLC withdrawn',
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
      title: 'BRIDGE xRLC/RLC',
      longTitle: 'Bridge your xRLC/RLC between chains',
      desc: 'Move your xRLC/RLC in your wallet between iExec Sidechain and Ethereum Mainnet with our bridge. ',
      content: (
        <Button asChild>
          <a
            href="https://bridge-bellecour.iex.ec/"
            rel="noreferrer"
            target="_blank"
          >
            Bridge <ExternalLink />
          </a>
        </Button>
      ),
    },
  ].filter((tab, index) => {
    if (index === 2 && chainId !== SUPPORTED_CHAINS[0].id) return false;
    return true;
  });
}
