import { DealQuery, TaskQuery } from '@/graphql/graphql';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getIExec } from '@/externals/iexecSdkClient';
import useUserStore from '@/stores/useUser.store';
import { pluralize } from '@/utils/pluralize';
import { sleep } from '@/utils/sleep';

function isClaimableTask(task: TaskQuery['task']): boolean {
  if (!task) return false;
  const isStatusValid = task.status === 'ACTIVE' || task.status === 'REVEALING';
  const isBeforeFinalDeadline = task.finalDeadline * 1000 < Date.now();
  return isStatusValid && isBeforeFinalDeadline;
}

function countClaimableTasks(deal: DealQuery['deal']): number {
  if (!deal) return 0;
  const finalDealineReached =
    (parseInt(deal.startTime) + parseInt(deal.category.workClockTimeRef) * 10) *
      1000 <
    Date.now();
  if (!finalDealineReached) {
    return 0;
  }
  return (
    parseInt(deal.botSize) -
    parseInt(deal.claimedTasksCount) -
    parseInt(deal.completedTasksCount)
  );
}

export function ClaimButton({
  taskOrDeal,
  className,
}: {
  taskOrDeal: TaskQuery['task'] | DealQuery['deal'];
  className?: string;
}) {
  const { isConnected } = useUserStore();
  const queryClient = useQueryClient();

  const task = (taskOrDeal as TaskQuery['task'])?.taskid
    ? (taskOrDeal as NonNullable<TaskQuery['task']>)
    : undefined;
  const deal: NonNullable<DealQuery['deal']> | undefined = (
    taskOrDeal as DealQuery['deal']
  )?.dealid
    ? (taskOrDeal as NonNullable<DealQuery['deal']>)
    : undefined;

  const claimCallback = () => {
    queryClient.invalidateQueries({ queryKey: ['task'] });
    queryClient.invalidateQueries({ queryKey: ['deal', 'tasks'] });
  };

  const { mutate: claimTasks, isPending } = useMutation({
    mutationFn: async () => {
      if (!taskOrDeal) return;
      try {
        const iexec = await getIExec();
        if (deal) {
          console.log('Claiming deal', deal.dealid);
          const { transactions } = await iexec.deal.claim(deal.dealid);
          console.log(
            `Deal ${deal.dealid} claimed with txs:`,
            JSON.stringify(transactions, null, 2)
          );
        } else if (task) {
          const task = taskOrDeal as NonNullable<TaskQuery['task']>;
          console.log('Claiming task', task.taskid);
          const txHash = await iexec.task.claim(task.taskid);
          console.log(`Task ${task.taskid} claimed with tx:`, txHash);
        }
      } catch (error) {
        console.error(`Failed to claim:`, error);
      }
      await sleep(5_000); // wait to allow subgraph to synchronize before invalidating the data
    },
    onSuccess: claimCallback,
    onError: claimCallback,
  });

  if (!isConnected || !taskOrDeal) return null;

  let claimableTaskCount = 0;
  if (deal) {
    claimableTaskCount = countClaimableTasks(deal);
  } else if (task) {
    claimableTaskCount = isClaimableTask(task) ? 1 : 0;
  }

  if (claimableTaskCount < 1) return null;

  return (
    <Button variant="link" className={className} onClick={() => claimTasks()}>
      Claim {pluralize(claimableTaskCount, 'task')}
      {isPending && <LoaderCircle className="animate-spin" />}
    </Button>
  );
}
