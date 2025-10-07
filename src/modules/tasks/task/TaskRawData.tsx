import { TABLE_REFETCH_INTERVAL } from '@/config';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { getIExec } from '@/externals/iexecSdkClient';
import { useLoginLogout } from '@/hooks/useLoginLogout';
import { ErrorAlert } from '@/modules/ErrorAlert';
import JsonBlock from '@/modules/JsonBlock';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

function useTaskRawData({
  taskWorkerpoolId,
  taskId,
}: {
  taskWorkerpoolId?: string;
  taskId: string;
}) {
  const { chainId } = useUserStore();

  const queryKey = [chainId, 'task', 'raw', taskWorkerpoolId, taskId];

  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: async () => {
        const iexec = await getIExec();
        const apiUrl = await iexec.workerpool.getWorkerpoolApiUrl(
          taskWorkerpoolId!
        );

        const response = await fetch(`${apiUrl}/tasks/${taskId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch task raw data');
        }
        return response.json();
      },
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
      enabled: !!taskWorkerpoolId && !!taskId,
    }
  );

  return {
    data,
    isLoading,
    isRefetching,
    isError,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

export function TaskRawData({
  taskWorkerpoolId,
  taskId,
}: {
  taskWorkerpoolId?: string;
  taskId: string;
}) {
  const {
    data: tasks,
    hasPastError,
    isLoading,
  } = useTaskRawData({ taskWorkerpoolId, taskId });
  const { address: userAddress } = useUserStore();
  const { login } = useLoginLogout();

  return hasPastError && (!tasks || !tasks.length) ? (
    <ErrorAlert
      message={
        "Unable to load raw task data: the workerpool associated with this task doesn't expose a public API"
      }
    />
  ) : (
    <div className="dark:bg-tooltip flex max-h-none min-h-60 rounded-3xl border bg-[#fafaff] p-6">
      {!userAddress ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <h1 className="text-2xl font-bold">You are not connected</h1>
          <p className="text-muted-foreground max-w-sm">
            To access task raw data please connect your wallet.
          </p>
          <div className="flex gap-4">
            <Button onClick={login}>Connect wallet</Button>
          </div>
        </div>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : (
        <JsonBlock className="w-full" collapsed={5}>
          {tasks}
        </JsonBlock>
      )}
    </div>
  );
}
