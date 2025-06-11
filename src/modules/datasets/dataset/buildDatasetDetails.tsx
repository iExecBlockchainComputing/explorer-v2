import { DatasetQuery } from '@/graphql/graphql';
import CopyButton from '@/components/CopyButton';
import SmartLinkGroup from '@/components/SmartLinkGroup';
import TransferEvent from '@/modules/events/TransferEvent';
import { multiaddrHexToHuman } from '@/utils/format';
import {
  formatDateCompact,
  formatElapsedTime,
} from '@/utils/formatElapsedTime';

export function buildDatasetDetails({
  dataset,
}: {
  dataset: DatasetQuery['dataset'];
}) {
  if (!dataset) {
    return {};
  }
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
            <div className="content" key={i}>
              <TransferEvent {...transferEvent} />
            </div>
          ))}
        </div>
      ),
    }),
  };
}
