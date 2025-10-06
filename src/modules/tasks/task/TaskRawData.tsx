import { TABLE_REFETCH_INTERVAL } from '@/config';
import { useQuery } from '@tanstack/react-query';
import { getIExec } from '@/externals/iexecSdkClient';
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

  return hasPastError && (!tasks || !tasks.length) ? (
    <ErrorAlert
      message={
        "Unable to load raw task data: the workerpool associated with this task doesn't expose a public API"
      }
    />
  ) : (
    <div className="dark:bg-tooltip min-h-40 rounded-3xl border bg-[#fafaff] p-6">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <JsonBlock collapsed={5}>{tasks}</JsonBlock>
      )}
    </div>
  );
}
