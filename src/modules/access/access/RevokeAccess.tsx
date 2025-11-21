import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  PublishedApporder,
  PublishedDatasetorder,
  PublishedWorkerpoolorder,
} from 'iexec/IExecOrderbookModule';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getIExec } from '@/externals/iexecSdkClient';
import useUserStore from '@/stores/useUser.store';
import { getChainFromId } from '@/utils/chain.utils';

export default function RevokeAccess({
  access,
  onRevoked,
}: {
  access: PublishedApporder | PublishedDatasetorder | PublishedWorkerpoolorder;
  onRevoked?: () => void;
}) {
  const { chainId, address: userAddress } = useUserStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const order = access.order;

  const revokeAccessMutation = useMutation({
    mutationFn: async () => {
      const iexec = await getIExec();

      if ('app' in order) {
        return await iexec.order.cancelApporder(order);
      } else if ('dataset' in order) {
        return await iexec.order.cancelDatasetorder(order);
      } else if ('workerpool' in order) {
        return await iexec.order.cancelWorkerpoolorder(order);
      } else {
        throw new Error('Unknown order type');
      }
    },
    onError: (err) => {
      console.error(err);
    },
    onSuccess: () => {
      let accessType = '';
      if ('app' in order) {
        accessType = 'App';
      } else if ('dataset' in order) {
        accessType = 'Dataset';
      } else {
        accessType = 'Workerpool';
      }
      queryClient.invalidateQueries({
        queryKey: [chainId, 'address', `${accessType}sGrantedAccess`],
      });
      // Navigate to the user's granted access tab if we have user address
      if (userAddress) {
        const chainSlug = chainId ? getChainFromId(chainId)?.slug : undefined;
        if (chainSlug) {
          navigate({
            to: `/${chainSlug}/address/${userAddress}`,
            search: { addressTab: 'GRANTED ACCESS' },
            replace: true,
          });
        }
      }
      if (onRevoked) onRevoked();
    },
  });

  if (!access) return;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => revokeAccessMutation.mutate()}
      disabled={revokeAccessMutation.isPending}
    >
      {revokeAccessMutation.isPending && (
        <LoaderCircle className="animate-spin" />
      )}
      Revoke access
    </Button>
  );
}
