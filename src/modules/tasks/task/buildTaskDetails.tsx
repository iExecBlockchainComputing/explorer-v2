import { Task } from '@/graphql/graphql';
import CopyButton from '@/components/CopyButton';
import SmartLinkGroup from '@/components/SmartLinkGroup';
import Bytes from '@/modules/Bytes';
import JsonBlock from '@/modules/JsonBlock';
import { taskResultToObject } from '@/utils/format';
import {
  formatDateCompact,
  formatElapsedTime,
} from '@/utils/formatElapsedTime';
import { truncateAddress } from '@/utils/truncateAddress';

export function buildTaskDetails({
  task,
  isConnected,
}: {
  task: Task;
  isConnected: boolean;
}) {
  console.log('task', task);

  const tasksCount = parseInt(task?.deal.botSize) || 1;
  const completedTasksCount = parseInt(task?.deal.completedTasksCount) || 0;
  const claimedTasksCount = parseInt(task?.deal.claimedTasksCount) || 0;
  const pendingTasksCount =
    tasksCount - (completedTasksCount + claimedTasksCount);

  const completedRatio = completedTasksCount / tasksCount;
  const claimedRatio = claimedTasksCount / tasksCount;
  const pendingRatio = pendingTasksCount / tasksCount;

  const isClaimable =
    task.finalDeadline * 1000 < Date.now() && isConnected && pendingRatio > 0;

  return {
    ...(task.taskid && {
      Taskid: (
        <div className="flex flex-wrap items-center gap-1">
          <span className="hidden md:inline">{task.taskid}</span>
          <span className="inline md:hidden">
            {truncateAddress(task.taskid)}
          </span>
          <CopyButton textToCopy={task.taskid} />
        </div>
      ),
    }),
    ...(task.deal.dealid && {
      Dealid: (
        <div className="flex flex-wrap items-center gap-1">
          <SmartLinkGroup
            type="deal"
            addressOrId={task.deal.dealid}
            label={task.deal.dealid}
          />
        </div>
      ),
    }),
    ...(task.deal.category !== undefined &&
      task.deal.category.workClockTimeRef !== undefined && {
        Category: (
          <p>
            {task.deal.category.catid} (
            {task.deal.category.workClockTimeRef * 10} sec)
          </p>
        ),
      }),
    ...(task.deal.tag && {
      Tag: <Bytes>{task.deal.tag}</Bytes>,
    }),
    ...(task.deal.app && {
      App: (
        <div className="flex flex-wrap items-center gap-1">
          {task.deal.app?.name}{' '}
          <SmartLinkGroup
            type="app"
            addressOrId={task.deal.app?.address}
            label={task.deal.app.address}
          />
        </div>
      ),
    }),
    ...(task.deal.dataset && {
      Dataset: (
        <div className="flex flex-wrap items-center gap-1">
          <SmartLinkGroup
            type="dataset"
            addressOrId={task.deal.dataset.address}
            label={task.deal.dataset.address}
          />
        </div>
      ),
    }),
    ...(task.deal.workerpool && {
      Workerpool: (
        <div className="flex flex-wrap items-center gap-1">
          {task.deal.workerpool.description}{' '}
          <SmartLinkGroup
            type="workerpool"
            addressOrId={task.deal.workerpool.address}
            label={task.deal.workerpool.address}
          />
        </div>
      ),
    }),
    ...(task.requester && {
      Requester: (
        <SmartLinkGroup
          type="address"
          addressOrId={task.requester.address}
          label={task.requester.address}
        />
      ),
    }),
    ...(task.deal.beneficiary && {
      Beneficiary: (
        <SmartLinkGroup
          type="address"
          addressOrId={task.deal.beneficiary.address}
          label={task.deal.beneficiary.address}
        />
      ),
    }),
    ...(task.deal.callback && {
      'Callback contract': (
        <SmartLinkGroup
          type="address"
          addressOrId={task.deal.callback.address}
          label={task.deal.callback.address}
        />
      ),
    }),
    ...((pendingRatio || completedRatio || claimedRatio) && {
      Status: (
        <span>
          <span className="flex flex-wrap items-center gap-2 text-xs font-medium">
            {completedRatio > 0 && (
              <span className="bg-success-foreground/10 border-success-border text-success-foreground rounded-full border px-2 py-1">
                {Math.round(completedRatio * 100)}% COMPLETED
              </span>
            )}

            {claimedRatio > 0 && (
              <span className="bg-info-foreground/10 border-info-border text-info-foreground rounded-full border px-2 py-1">
                {Math.round(claimedRatio * 100)}% CLAIMED
              </span>
            )}

            {pendingRatio > 0 && (
              <span
                className={`rounded-full border px-2 py-1 ${
                  isClaimable
                    ? 'bg-info-foreground/10 border-info-border text-info-foreground'
                    : 'bg-warning-foreground/10 border-warning-border text-warning-foreground'
                }`}
              >
                {Math.round(pendingRatio * 100)}%{' '}
                {isClaimable ? 'CLAIMABLE' : 'PENDING'}
              </span>
            )}
          </span>

          {/* {isClaimable && <ClaimFailedTask taskId="" />} // TODO  */}
        </span>
      ),
    }),
    ...(task.results && {
      Result: <JsonBlock>{taskResultToObject(task.results)}</JsonBlock>,
    }),
    ...(task.resultsCallback && {
      'Callback data': <Bytes>{task.resultsCallback}</Bytes>,
    }),
    ...(task.resultDigest && {
      'Result digest': <Bytes>{task.resultDigest}</Bytes>,
    }),
    ...(task.finalDeadline && {
      Deadline: (
        <p>
          {formatElapsedTime(task.finalDeadline)}{' '}
          {formatDateCompact(task.finalDeadline)}
        </p>
      ),
    }),
    ...(task.contributionDeadline && {
      'Contribution deadline': (
        <p>
          {formatElapsedTime(task.contributionDeadline)} (
          {formatDateCompact(task.contributionDeadline)})
        </p>
      ),
    }),
    ...(Array.isArray(task?.taskEvents) && {
      Events: (
        <div className="flex flex-col gap-2">
          {task.taskEvents.map((taskEvent, i) => (
            <div className="flex flex-wrap items-center gap-1" key={i}>
              {taskEvent.type && taskEvent.type}
              {taskEvent.transaction.txHash && (
                <SmartLinkGroup
                  type="address"
                  addressOrId={taskEvent.transaction.txHash}
                  label={taskEvent.transaction.txHash}
                />
              )}
            </div>
          ))}
        </div>
      ),
    }),
  };
}
