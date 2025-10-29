import SmartLinkGroup from '@/components/SmartLinkGroup';
import {
  formatDateCompact,
  formatElapsedTime,
} from '@/utils/formatElapsedTime';

export function buildAccessDetails({
  access,
}: {
  access: Record<string, any>;
}) {
  if (!access) return {};

  const order = access.order || {};

  return {
    ...(access.orderHash && {
      'Order Hash': (
        <SmartLinkGroup
          type="transaction"
          isCurrentPage={true}
          addressOrId={access.orderHash.toLowerCase()}
          label={access.orderHash.toLowerCase()}
        />
      ),
    }),
    // ...(access.status && { Status: <span>{access.status}</span> }),
    ...(order.dataset && {
      Dataset: (
        <SmartLinkGroup
          type="dataset"
          addressOrId={order.dataset.toLowerCase()}
          label={order.dataset.toLowerCase()}
        />
      ),
    }),
    ...(order.datasetprice !== undefined && {
      'Dataset Price': <span>{order.datasetprice}</span>,
    }),
    ...(order.app && {
      App: (
        <SmartLinkGroup
          type="app"
          addressOrId={order.app.toLowerCase()}
          label={order.app.toLowerCase()}
        />
      ),
    }),
    ...(order.appprice !== undefined && {
      'App Price': <span>{order.appprice}</span>,
    }),
    ...(order.workerpool && {
      Workerpool: (
        <SmartLinkGroup
          type="workerpool"
          addressOrId={order.workerpool.toLowerCase()}
          label={order.workerpool.toLowerCase()}
        />
      ),
    }),
    ...(order.workerpoolprice !== undefined && {
      'Workerpool Price': <span>{order.workerpoolprice}</span>,
    }),
    ...(order.volume !== undefined && {
      Volume: <span>{order.volume}</span>,
    }),
    ...(access.remaining !== undefined && {
      Remaining: <span>{access.remaining}</span>,
    }),
    ...(order.salt && { Salt: <span>{order.salt}</span> }),
    ...(order.tag && { Tag: <span>{order.tag}</span> }),
    ...(order.apprestrict && {
      'App Restrict': (
        <SmartLinkGroup
          type="app"
          addressOrId={order.apprestrict.toLowerCase()}
          label={order.apprestrict.toLowerCase()}
        />
      ),
    }),
    ...(order.requesterrestrict && {
      'Requester Restrict': (
        <SmartLinkGroup
          type="address"
          addressOrId={order.requesterrestrict.toLowerCase()}
          label={order.requesterrestrict.toLowerCase()}
        />
      ),
    }),
    ...(order.workerpoolrestrict && {
      'Workerpool Restrict': (
        <SmartLinkGroup
          type="workerpool"
          addressOrId={order.workerpoolrestrict.toLowerCase()}
          label={order.workerpoolrestrict.toLowerCase()}
        />
      ),
    }),
    ...(access.signer && {
      Signer: (
        <SmartLinkGroup
          type="address"
          addressOrId={access.signer.toLowerCase()}
          label={access.signer.toLowerCase()}
        />
      ),
    }),
    ...(access.publicationTimestamp && {
      Publication: (
        <p>
          {formatElapsedTime(
            new Date(access.publicationTimestamp).getTime() / 1000
          )}{' '}
          (
          {formatDateCompact(
            new Date(access.publicationTimestamp).getTime() / 1000
          )}
          )
        </p>
      ),
    }),
    ...(order.sign && { Signature: <span>{order.sign}</span> }),
    ...(access.ok !== undefined && {
      Ok: <span>{access.ok ? 'Yes' : 'No'}</span>,
    }),
  };
}
