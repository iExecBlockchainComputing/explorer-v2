import { Deal } from '@/graphql/graphql';

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
    color = '#11B15E';
  } else if (!timeout) {
    color = '#F4C503';
  } else {
    color = '#EF5353';
  }

  return (
    <div
      style={{
        color: color,
      }}
    >
      {successRate * 100}%
    </div>
  );
}
