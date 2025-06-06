import { Task } from '@/graphql/graphql';
import { Button } from '@/components/ui/button';
import { getIExec } from '@/externals/iexecSdkClient';
import { pluralize } from '@/utils/pluralize';

function isClaimable(task: Task): boolean {
  const isStatusValid = task.status === 'ACTIVE' || task.status === 'REVEALING';
  const isBeforeFinalDeadline = task.contributionDeadline * 1000 < Date.now();
  return isStatusValid && isBeforeFinalDeadline;
}

export function ClaimButton({
  tasks,
  className,
}: {
  tasks: Task[];
  className?: string;
}) {
  const claimableTasks = tasks.filter(isClaimable);

  if (claimableTasks.length === 0) {
    return null;
  }

  const handleClaimAll = async () => {
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
  };

  return (
    <Button variant="link" className={className} onClick={handleClaimAll}>
      Claim {claimableTasks.length} {pluralize(claimableTasks.length, 'task')}
    </Button>
  );
}
