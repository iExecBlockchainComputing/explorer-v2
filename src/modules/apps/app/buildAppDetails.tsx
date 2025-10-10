import { AppQuery } from '@/graphql/poco/graphql';
import CopyButton from '@/components/CopyButton';
import SmartLinkGroup from '@/components/SmartLinkGroup';
import JsonBlock from '@/modules/JsonBlock';
import TransferEvent from '@/modules/events/TransferEvent';
import { mrEnclaveHexToHuman, multiaddrHexToHuman } from '@/utils/format';
import {
  formatDateCompact,
  formatElapsedTime,
} from '@/utils/formatElapsedTime';

export function buildAppDetails({ app }: { app: AppQuery['app'] }) {
  if (!app) {
    return {};
  }
  const firstTransfer = Array.isArray(app?.transfers) && app?.transfers[0];
  const firstTimestamp = firstTransfer?.transaction?.timestamp;

  return {
    ...(app.address && {
      Address: (
        <SmartLinkGroup
          type={'address'}
          addressOrId={app.address}
          isCurrentPage={true}
        />
      ),
    }),
    ...(app.name && {
      Name: <p>{app.name}</p>,
    }),
    ...(app.owner.address && {
      Owner: (
        <SmartLinkGroup type={'address'} addressOrId={app.owner.address} />
      ),
    }),
    ...(firstTimestamp && {
      Created: (
        <p>
          {formatElapsedTime(firstTimestamp)} (
          {formatDateCompact(firstTimestamp)})
        </p>
      ),
    }),
    ...(app.multiaddr && {
      Multiaddr: (
        <div className="flex items-center gap-1">
          {multiaddrHexToHuman(app.multiaddr)}
          <CopyButton textToCopy={multiaddrHexToHuman(app.multiaddr)} />
        </div>
      ),
    }),
    ...(app.checksum && {
      Checksum: (
        <div className="flex items-center gap-1">
          {app.checksum}
          <CopyButton textToCopy={app.checksum} />
        </div>
      ),
    }),
    ...(app.mrenclave &&
      app.mrenclave !== '0x' && {
        MrEnclave: <JsonBlock>{mrEnclaveHexToHuman(app.mrenclave)}</JsonBlock>,
      }),
    ...(app.transfers && {
      Transfers: (
        <div className="flex flex-col gap-2">
          {app.transfers.map((transferEvent, i) => (
            <div className="content" key={i}>
              <TransferEvent {...transferEvent} />
            </div>
          ))}
        </div>
      ),
    }),
  };
}
