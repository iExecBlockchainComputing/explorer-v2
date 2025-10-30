import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  PublishedApporder,
  PublishedDatasetorder,
  PublishedWorkerpoolorder,
} from 'iexec/IExecOrderbookModule';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getIExec } from '@/externals/iexecSdkClient';
import useUserStore from '@/stores/useUser.store';

export default function RevokeAccess({
  access,
}: {
  access: PublishedApporder | PublishedDatasetorder | PublishedWorkerpoolorder;
}) {
  const { chainId } = useUserStore();
  const queryClient = useQueryClient();

  if (!access) return;

  console.log('access to revoke', access);

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
    },
  });

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        revokeAccessMutation.mutate();
      }}
    >
      {revokeAccessMutation.isPending && (
        <LoaderCircle className="animate-spin" />
      )}
      Revoke access
    </Button>
  );
}
