import { Workerpool } from '@/graphql/graphql';
import SmartLinkGroup from '@/components/SmartLinkGroup';
import {
  formatDateCompact,
  formatElapsedTime,
} from '@/utils/formatElapsedTime';

export function buildWorkerpoolDetails({
  workerpool,
}: {
  workerpool: Workerpool;
}) {
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
            <div key={i}>
              Transfer
              {transferEvent.txHash && (
                <SmartLinkGroup
                  type={'transaction'}
                  addressOrId={transferEvent.txHash}
                />
              )}
              {transferEvent.app && (
                <span className="flex items-center gap-1">
                  {'app '}
                  <SmartLinkGroup
                    type={'app'}
                    addressOrId={transferEvent.app}
                  />
                </span>
              )}
              {transferEvent.dataset && (
                <span className="flex items-center gap-1">
                  {'workerpool '}
                  <SmartLinkGroup
                    type={'workerpool'}
                    addressOrId={transferEvent.dataset.address}
                  />
                </span>
              )}
              {transferEvent.workerpool && (
                <div className="flex items-center gap-1">
                  {'workerpool '}
                  <SmartLinkGroup
                    type={'workerpool'}
                    addressOrId={transferEvent.workerpool.address}
                  />
                </div>
              )}
              <div className="flex items-center gap-1">
                {'from '}
                <SmartLinkGroup
                  type={'address'}
                  addressOrId={transferEvent.from.address}
                />
              </div>{' '}
              <div className="flex items-center gap-1">
                {'to '}
                <SmartLinkGroup
                  type={'address'}
                  addressOrId={transferEvent.to.address}
                />
              </div>
            </div>
          ))}
        </div>
      ),
    }),
  };
}
