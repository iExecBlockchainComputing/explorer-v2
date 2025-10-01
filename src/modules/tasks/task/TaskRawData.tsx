import { TABLE_REFETCH_INTERVAL } from '@/config';
import { useQuery } from '@tanstack/react-query';
import { ErrorAlert } from '@/modules/ErrorAlert';
import JsonBlock from '@/modules/JsonBlock';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

function useTaskRawData({ taskId }: { taskId: string }) {
  const { chainId } = useUserStore();

  const queryKey = [chainId, 'task', 'raw', taskId];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: async () => {
        const response = await fetch(
          `https://core-prod.arbitrum-mainnet.iex.ec/tasks/${taskId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch task raw data');
        }
        console.log(response);

        return response.json();
      },
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
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

export function TaskRawData({ taskId }: { taskId: string }) {
  const { data: tasks, hasPastError } = useTaskRawData({ taskId });

  // TODO: handle loading state

  return hasPastError && !tasks.length ? (
    <ErrorAlert message="An error occurred during task raw data loading." />
  ) : (
    <div className="dark:bg-tooltip rounded-3xl border bg-[#fafaff] p-6">
      <JsonBlock copyText="Copy all" collapsed={5}>
        {tasks}
      </JsonBlock>
    </div>
  );
}
