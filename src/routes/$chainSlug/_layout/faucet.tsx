import { FAUCET_API_URL } from '@/config';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useWatchAsset } from 'wagmi';
import { ChainLink } from '@/components/ChainLink';
import WalletIcon from '@/components/icons/WalletIcon';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChainSwitch } from '@/hooks/useChainSwitch';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { FaucetBreadcrumbs } from '@/modules/faucet/FaucetBreadcrumbs';
import useUserStore from '@/stores/useUser.store';
import { getBlockExplorerUrl } from '@/utils/chain.utils';
import wagmiNetworks from '@/utils/wagmiNetworks';

export const Route = createFileRoute('/$chainSlug/_layout/faucet')({
  component: FaucetRoute,
});

function FaucetRoute() {
  const { chainId, address: userAddress } = useUserStore();
  const { requestChainChange } = useChainSwitch();
  const { getToken, isSignedIn } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [requestFundsAddress, setRequestFundsAddress] = useState(
    userAddress || ''
  );
  const { watchAsset } = useWatchAsset();

  const badChainId = chainId !== wagmiNetworks.arbitrumSepolia.id;

  const {
    mutate: requestFunds,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async () => {
      if (!requestFundsAddress || !isSignedIn) {
        throw new Error('User not connected or no address specified');
      }

      const token = await getToken();
      if (!token) {
        throw new Error('Unable to get authentication token');
      }

      const response = await fetch(`${FAUCET_API_URL}/faucet/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipientAddress: requestFundsAddress }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('errorText', errorText);

        let errorMessage = `Request failed with status ${response.status}`;

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Use default message if JSON parsing fails
        }

        throw new Error(errorMessage);
      }
      watchAsset({
        type: 'ERC20',
        options: {
          address: '0x9923eD3cbd90CD78b910c475f9A731A6e0b8C963',
          symbol: 'RLC',
          decimals: 9,
        },
      });

      return response.json();
    },
    onMutate: () => setSuccessMessage(''),
    onSuccess: (data) => {
      const explorerUrl = getBlockExplorerUrl(wagmiNetworks.arbitrumSepolia.id);
      setSuccessMessage(
        `${data.amount} RLC sent to your wallet. View transaction: ${explorerUrl}/tx/${data.transactionHash}`
      );
    },
    onError: () => setSuccessMessage(''),
  });

  if (badChainId) {
    return (
      <div className="mt-20 flex flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-2xl font-bold">
          {badChainId ? 'You are not on the correct network' : ''}
        </h1>
        <p className="text-muted-foreground max-w-sm">
          {badChainId
            ? 'To access the iExec Faucet, please switch to Arbitrum Sepolia network.'
            : ''}
        </p>
        <div className="flex gap-4">
          <Button variant="outline">
            <ChainLink to="/">Go back home</ChainLink>
          </Button>
          {badChainId && (
            <Button
              onClick={() =>
                requestChainChange(wagmiNetworks.arbitrumSepolia.id)
              }
            >
              Switch to Arbitrum Sepolia
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6">
      <div className="mt-6 flex flex-col justify-between lg:flex-row">
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
            <WalletIcon size={24} />
            Faucet
          </h1>
          <div className="flex items-center gap-2">
            <BackButton />
            <FaucetBreadcrumbs />
          </div>
        </div>
      </div>
      <div className="md:border-intermediate space-y-6 md:rounded-3xl md:border md:p-10">
        <div className="space-y-4 md:space-y-1.5">
          <h2 className="md:font-anybody font-sans font-bold">Request funds</h2>
          <p>Add fund to your wallet for testing on Arbitrum Sepolia</p>
        </div>
        <SignedOut>
          <Button asChild className="mx-auto">
            <SignInButton />
          </Button>
        </SignedOut>
        <SignedIn>
          <div className="space-y-4">
            <div className="flex flex-col justify-center gap-4 md:flex-row md:items-center">
              <div className="flex-none">
                <UserButton
                  showName
                  appearance={{
                    elements: {
                      userButtonTrigger: {
                        background: 'var(--primary-foreground)',
                        color: 'var(--primary)',
                        borderRadius: '9999px',
                        padding: '8px',
                      },
                    },
                  }}
                />
              </div>
              <div className="relative w-full">
                <Input
                  className="max-w-80 min-w-full pr-11"
                  type="text"
                  placeholder="Wallet address"
                  required
                  value={requestFundsAddress}
                  onChange={(e) => setRequestFundsAddress(e.target.value)}
                />
                {userAddress && (
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    className="absolute inset-y-1.5 right-1"
                    onClick={() => {
                      setRequestFundsAddress(userAddress);
                    }}
                  >
                    Current Address
                  </Button>
                )}
              </div>
              <Button
                onClick={() => requestFunds()}
                disabled={isPending || !requestFundsAddress || !isSignedIn}
                className="md:ml-auto md:w-fit"
              >
                {isPending ? 'Requesting funds...' : 'Request funds'}
              </Button>
            </div>

            {isError && (
              <ErrorAlert className="w-full" message={error?.message} />
            )}

            {successMessage && (
              <div className="border-success-border bg-success-foreground/10 text-success-foreground rounded-md border p-3 text-sm">
                <div className="flex flex-col gap-2">
                  <div>{successMessage.split('View transaction:')[0]}</div>
                  {successMessage.includes('View transaction:') && (
                    <a
                      href={successMessage.split('View transaction: ')[1]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-success-foreground underline"
                    >
                      View transaction on Arbiscan ↗
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
