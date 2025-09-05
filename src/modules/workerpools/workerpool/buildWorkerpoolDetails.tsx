import { WorkerpoolQuery } from '@/graphql/poco/graphql';
import SmartLinkGroup from '@/components/SmartLinkGroup';
import TransferEvent from '@/modules/events/TransferEvent';
import {
  formatDateCompact,
  formatElapsedTime,
} from '@/utils/formatElapsedTime';

export function buildWorkerpoolDetails({
  workerpool,
}: {
  workerpool: WorkerpoolQuery['workerpool'];
}) {
  if (!workerpool) {
    return {};
  }
  const firstTransfer =
    Array.isArray(workerpool?.transfers) && workerpool?.transfers[0];
  const firstTimestamp = firstTransfer?.transaction?.timestamp;

  return {
    ...(workerpool.address && {
      Address: (
        <SmartLinkGroup
          type={'address'}
          addressOrId={workerpool.address}
          isCurrentPage={true}
        />
      ),
    }),
    ...(workerpool.description && {
      Description: <p>{workerpool.description}</p>,
    }),
    ...(workerpool.owner && {
      Owner: (
        <SmartLinkGroup
          type={'address'}
          addressOrId={workerpool.owner.address}
        />
      ),
    }),
    ...(firstTimestamp && {
      Created: (
        <p>
          {formatElapsedTime(firstTimestamp)}{' '}
          {formatDateCompact(firstTimestamp)}
        </p>
      ),
    }),
    ...(workerpool.transfers && {
      Transfers: (
        <div className="flex flex-col gap-2">
          {workerpool.transfers.map((transferEvent, i) => (
            <div className="content" key={i}>
              <TransferEvent {...transferEvent} />
            </div>
          ))}
        </div>
      ),
    }),
  };
}
