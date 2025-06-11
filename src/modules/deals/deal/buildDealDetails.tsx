import { DealQuery } from '@/graphql/graphql';
import CopyButton from '@/components/CopyButton';
import SmartLinkGroup from '@/components/SmartLinkGroup';
import Bytes from '@/modules/Bytes';
import JsonBlock from '@/modules/JsonBlock';
import DealEvent from '@/modules/events/DealEvent';
import { ClaimButton } from '@/modules/tasks/ClaimButton';
import {
  formatDateCompact,
  formatElapsedTime,
} from '@/utils/formatElapsedTime';
import { truncateAddress } from '@/utils/truncateAddress';

export function buildDealDetails({
  deal,
  isConnected,
}: {
  deal: DealQuery['deal'];
  isConnected: boolean;
}) {
  if (!deal) {
    return {};
  }
  const dealDeadline =
    deal?.startTime &&
    deal?.category.workClockTimeRef &&
    parseInt(deal?.startTime) + parseInt(deal?.category.workClockTimeRef) * 10;

  const tasksCount = parseInt(deal?.botSize) || 1;
  const completedTasksCount = parseInt(deal?.completedTasksCount) || 0;
  const claimedTasksCount = parseInt(deal?.claimedTasksCount) || 0;
  const pendingTasksCount =
    tasksCount - (completedTasksCount + claimedTasksCount);

  const completedRatio = completedTasksCount / tasksCount;
  const claimedRatio = claimedTasksCount / tasksCount;
  const pendingRatio = pendingTasksCount / tasksCount;

  const isClaimable =
    dealDeadline * 1000 < Date.now() && isConnected && pendingRatio > 0;

  return {
    ...(deal.dealid && {
      Dealid: (
        <div className="flex flex-wrap items-center gap-1">
          <span className="hidden md:inline">{deal.dealid}</span>
          <span className="inline md:hidden">
            {truncateAddress(deal.dealid)}
          </span>
          <CopyButton textToCopy={deal.dealid} />
        </div>
      ),
    }),
    ...(deal.category.catid !== undefined &&
      deal.category.workClockTimeRef !== undefined && {
        Category: (
          <p>
            {deal.category.catid} ({deal.category.workClockTimeRef * 10} sec)
          </p>
        ),
      }),
    ...(deal.tag && {
      Tag: <Bytes>{deal.tag}</Bytes>,
    }),
    ...(deal.trust && {
      Trust: <p>{deal.trust}</p>,
    }),
    ...(deal.app && {
      App: (
        <div className="flex flex-wrap items-center gap-1">
          {deal.app?.name}{' '}
          <SmartLinkGroup
            type="app"
            addressOrId={deal.app?.address}
            label={deal.app.address}
          />
        </div>
      ),
      'App price': <p>{deal.appPrice}</p>,
    }),
    ...(deal.dataset && {
      Dataset: (
        <div className="flex flex-wrap items-center gap-1">
          <SmartLinkGroup
            type="dataset"
            addressOrId={deal.dataset.address}
            label={deal.dataset.address}
          />
        </div>
      ),
      'Dataset price': <p>{deal.datasetPrice}</p>,
    }),
    ...(deal.workerpool && {
      Workerpool: (
        <div className="flex flex-wrap items-center gap-1">
          {deal.workerpool.description}{' '}
          <SmartLinkGroup
            type="workerpool"
            addressOrId={deal.workerpool.address}
            label={deal.workerpool.address}
          />
        </div>
      ),
      'Workerpool price': <p>{deal.workerpoolPrice}</p>,
    }),
    ...(deal.requester && {
      Requester: (
        <SmartLinkGroup
          type="address"
          addressOrId={deal.requester.address}
          label={deal.requester.address}
        />
      ),
    }),
    ...(deal.beneficiary && {
      Beneficiary: (
        <SmartLinkGroup
          type="address"
          addressOrId={deal.beneficiary.address}
          label={deal.beneficiary.address}
        />
      ),
    }),
    ...(deal.callback && {
      'Callback contract': (
        <SmartLinkGroup
          type="address"
          addressOrId={deal.callback.address}
          label={deal.callback.address}
        />
      ),
    }),
    ...(deal.params && {
      Params: <JsonBlock>{deal.params}</JsonBlock>,
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
                {isClaimable ? (
                  <>
                    CLAIMABLE
                    <ClaimButton
                      taskOrDeal={deal}
                      className="text-white underline"
                    />
                  </>
                ) : (
                  'PENDING'
                )}
              </span>
            )}
          </span>
        </span>
      ),
    }),
    ...(deal.botSize && {
      'Tasks count': <p>{deal.botSize}</p>,
    }),
    ...(deal.completedTasksCount && {
      'Completed tasks count': <p>{deal.completedTasksCount}</p>,
    }),
    ...(deal.claimedTasksCount && {
      'Claimed tasks count': <p>{deal.claimedTasksCount}</p>,
    }),
    ...(deal.startTime && {
      'Start time': (
        <p>
          {formatElapsedTime(deal.startTime)}{' '}
          {formatDateCompact(deal.startTime)}
        </p>
      ),
    }),
    ...(dealDeadline && {
      Deadline: (
        <p>
          {formatElapsedTime(dealDeadline)} {formatDateCompact(dealDeadline)}
        </p>
      ),
    }),
    ...(Array.isArray(deal?.dealEvents) && {
      Events: deal.dealEvents.map((dealEvent, i) => (
        <div className="content" key={i}>
          <DealEvent {...dealEvent} />
        </div>
      )),
    }),
  };
}
