import { FAUCET_API_URL } from '@/config';
import {
  SignedIn,
  SignedOut,
  SignIn,
  useAuth,
  UserButton,
} from '@clerk/clerk-react';
import { shadcn } from '@clerk/themes';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useWatchAsset } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChainSwitch } from '@/hooks/useChainSwitch';
import { ErrorAlert } from '@/modules/ErrorAlert';
import useUserStore from '@/stores/useUser.store';
import { getBlockExplorerUrl } from '@/utils/chain.utils';
import { nrlcToRlc } from '@/utils/nrlcToRlc';
import wagmiNetworks from '@/utils/wagmiNetworks';

export function Faucet() {
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

      return response.json();
    },
    onMutate: () => setSuccessMessage(''),
    onSuccess: (data) => {
      const explorerUrl = getBlockExplorerUrl(wagmiNetworks.arbitrumSepolia.id);
      setSuccessMessage(
        `${nrlcToRlc(data.amount)} RLC sent to your wallet. View transaction: ${explorerUrl}/tx/${data.transactionHash}`
      );
    },
    onError: () => setSuccessMessage(''),
  });

  const addTokenToWallet = useMutation({
    mutationFn: async () => {
      watchAsset({
        type: 'ERC20',
        options: {
          address: '0x9923eD3cbd90CD78b910c475f9A731A6e0b8C963',
          symbol: 'RLC',
          decimals: 9,
        },
      });
    },
  });

  return (
    <div className="grid max-w-xl gap-6 rounded-2xl border p-4 md:p-10">
      <h1 className="w-full text-center text-2xl font-extrabold">Faucet</h1>
      {isError && <ErrorAlert className="w-full" message={error?.message} />}
      {badChainId ? (
        <div className="flex flex-col gap-10">
          <div className="w-full space-y-4">
            <h2 className="text-lg font-bold">Select Network</h2>
            <p className="text-muted-foreground max-w-sm">
              Switch to Arbitrum Sepolia network to claim faucet.
            </p>
          </div>
          <Button
            className="mx-auto"
            onClick={() => requestChainChange(wagmiNetworks.arbitrumSepolia.id)}
          >
            Switch to Arbitrum Sepolia
          </Button>
        </div>
      ) : (
        !successMessage && (
          <div className="grid gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="font-sans text-lg font-bold">
                  Verify your identity
                </h2>
                <p className="text-muted-foreground">
                  Sign in with GitHub to request funds from the faucet.
                </p>
              </div>
              <SignedOut>
                <SignIn
                  appearance={{
                    theme: shadcn,
                    elements: {
                      header: { display: 'none' },
                      footer: { display: 'none' },
                      rootBox: {
                        width: '100%',
                      },
                      cardBox: {
                        boxShadow: 'none',
                        backgroundColor: 'transparent',
                        overflow: 'visible',
                        width: '100%',
                      },
                      card: {
                        border: 'none',
                        padding: '0',
                        boxShadow: 'none',
                      },
                      main: {
                        gap: '0',
                        borderRadius: '0',
                      },
                      socialButtonsRoot: {
                        gap: '16px',
                      },
                    },
                  }}
                />
              </SignedOut>
              <SignedIn>
                <div className="flex-none">
                  <UserButton
                    showName
                    appearance={{
                      theme: shadcn,
                      elements: {
                        userButtonBox: {
                          padding: '0px',
                        },
                        userButtonOuterIdentifier: {
                          padding: '0px',
                        },
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </div>
            <div className="grid gap-10">
              <div className="w-full space-y-2">
                <Label
                  className="font-sans text-lg font-bold"
                  htmlFor="wallet-address"
                >
                  Wallet Address
                </Label>
                <div className="relative">
                  <Input
                    id="wallet-address"
                    className="border-border max-w-80 min-w-full pr-11"
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
                      className="border-foreground absolute inset-y-1.5 right-1"
                      onClick={() => {
                        setRequestFundsAddress(userAddress);
                      }}
                    >
                      Current Address
                    </Button>
                  )}
                </div>
              </div>
              <Button
                onClick={() => requestFunds()}
                disabled={isPending || !requestFundsAddress || !isSignedIn}
                className="mx-auto"
              >
                {isPending ? 'Requesting funds...' : 'Request funds'}
              </Button>
            </div>
          </div>
        )
      )}
      {successMessage && (
        <div className="grid gap-4">
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
                  View transaction on Arbiscan Sepolia ↗
                </a>
              )}
            </div>
          </div>
          <Button
            onClick={() => addTokenToWallet.mutate()}
            disabled={addTokenToWallet.isPending}
            className="mx-auto"
          >
            {addTokenToWallet.isPending
              ? 'Adding token...'
              : 'Add token to current wallet'}
          </Button>
        </div>
      )}
    </div>
  );
}
