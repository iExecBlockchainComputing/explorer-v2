import { TaskQuery } from '@/graphql/graphql';
import CopyButton from '@/components/CopyButton';
import SmartLinkGroup from '@/components/SmartLinkGroup';
import Bytes from '@/modules/Bytes';
import JsonBlock from '@/modules/JsonBlock';
import TaskEvent from '@/modules/events/TaskEvent';
import useUserStore from '@/stores/useUser.store';
import { taskResultToObject } from '@/utils/format';
import {
  formatDateCompact,
  formatElapsedTime,
} from '@/utils/formatElapsedTime';
import { truncateAddress } from '@/utils/truncateAddress';
import { ClaimButton } from '../ClaimButton';
import { DownloadLogs } from '../DownloadLogs';
import { DownloadResult } from '../DownloadResult';
import StatusCell from '../StatusCell';

export function buildTaskDetails({ task }: { task: TaskQuery['task'] }) {
  if (!task) {
    return {};
  }

  const { address: userAddress } = useUserStore.getState();
  const isCurrentUser = task.requester.address === userAddress;

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
    ...(task.status && {
      Status: (
        <div>
          <StatusCell
            statusEnum={task.status}
            timeoutTimestamp={task.finalDeadline * 1000}
          />
          <ClaimButton taskOrDeal={task} className="text-white underline" />
          <DownloadResult taskid={task.taskid} taskResults={task.results} />
        </div>
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
    ...(isCurrentUser && {
      Logs: <DownloadLogs taskid={task.taskid} />,
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
            <div className="content" key={i}>
              <TaskEvent {...taskEvent} />
            </div>
          ))}
        </div>
      ),
    }),
  };
}
