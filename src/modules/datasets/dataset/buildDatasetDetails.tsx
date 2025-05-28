import { Dataset } from '@/graphql/graphql';
import CopyButton from '@/components/CopyButton';
import SmartLinkGroup from '@/components/SmartLinkGroup';
import { multiaddrHexToHuman } from '@/utils/format';
import {
  formatDateCompact,
  formatElapsedTime,
} from '@/utils/formatElapsedTime';

export function buildDatasetDetails({ dataset }: { dataset: Dataset }) {
  const firstTransfer =
    Array.isArray(dataset?.transfers) && dataset?.transfers[0];
  const firstTimestamp = firstTransfer?.transaction?.timestamp;

  return {
    ...(dataset.address && {
      Address: (
        <SmartLinkGroup
          type={'address'}
          addressOrId={dataset.address}
          isCurrentPage={true}
        />
      ),
    }),
    ...(dataset.name && {
      Name: <p>{dataset.name}</p>,
    }),
    ...(dataset.owner && {
      Owner: (
        <SmartLinkGroup type={'address'} addressOrId={dataset.owner.address} />
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
    ...(dataset.multiaddr && {
      Multiaddr: (
        <div className="flex items-center gap-1">
          {multiaddrHexToHuman(dataset.multiaddr)}
          <CopyButton textToCopy={multiaddrHexToHuman(dataset.multiaddr)} />
        </div>
      ),
    }),
    ...(dataset.checksum && {
      Checksum: (
        <div className="flex items-center gap-1">
          {dataset.checksum}
          <CopyButton textToCopy={dataset.checksum} />
        </div>
      ),
    }),
    ...(dataset.transfers && {
      Transfers: (
        <div className="flex flex-col gap-2">
          {dataset.transfers.map((transferEvent, i) => (
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
                  {'dataset '}
                  <SmartLinkGroup
                    type={'dataset'}
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
