import { Task, TaskQuery } from '@/graphql/graphql';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getIExec } from '@/externals/iexecSdkClient';
import useUserStore from '@/stores/useUser.store';
import { pluralize } from '@/utils/pluralize';

function isClaimable(task: Task): boolean {
  const isStatusValid = task.status === 'ACTIVE' || task.status === 'REVEALING';
  const isBeforeFinalDeadline = task.finalDeadline * 1000 < Date.now();
  return isStatusValid && isBeforeFinalDeadline;
}

export function ClaimButton({
  tasks,
  className,
}: {
  tasks: TaskQuery['task'];
  className?: string;
}) {
  const { isConnected } = useUserStore();
  const queryClient = useQueryClient();

  const { mutate: claimTasks, isPending } = useMutation({
    mutationFn: async () => {
      const iexec = await getIExec();

      for (const task of claimableTasks) {
        try {
          console.log('Claiming task', task.taskid);
          const txHash = await iexec.task.claim(task.taskid);
          console.log(`Task ${task.taskid} claimed with txHash:`, txHash);
        } catch (error) {
          console.error(`Failed to claim task ${task.taskid}:`, error);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task'] });
      queryClient.invalidateQueries({ queryKey: ['deal', 'tasks'] });
    },
  });

  if (!isConnected || !tasks) return null;

  const claimableTasks = tasks.filter(isClaimable);
  if (claimableTasks.length === 0) return null;

  return (
    <Button variant="link" className={className} onClick={() => claimTasks()}>
      Claim {pluralize(claimableTasks.length, 'task')}
      {isPending && <LoaderCircle className="animate-spin" />}
    </Button>
  );
}
