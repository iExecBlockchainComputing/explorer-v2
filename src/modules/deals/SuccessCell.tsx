import { Deal } from '@/graphql/poco/graphql';

export function SuccessCell({ deal }: { deal: Deal }) {
  const timeoutTimestamp =
    deal?.startTime &&
    deal?.category?.workClockTimeRef &&
    (parseInt(deal?.startTime) +
      parseInt(deal?.category?.workClockTimeRef) * 10) *
      1000;

  const tasksCount = parseInt(deal?.botSize) || 1;
  const completedTasksCount = parseInt(deal?.completedTasksCount) || 0;
  const successRate = completedTasksCount / tasksCount;

  const timeout = timeoutTimestamp && timeoutTimestamp < Date.now();
  let color;
  if (successRate === 1) {
    color = 'text-success-foreground';
  } else if (!timeout) {
    color = 'text-warning-foreground';
  } else {
    color = 'text-danger-foreground';
  }

  return <div className={color}>{successRate * 100}%</div>;
}
