import { App } from 'iexec/IExecAppModule';
import { Dataset } from 'iexec/IExecDatasetModule';
import {
  PublishedApporder,
  PublishedDatasetorder,
  PublishedWorkerpoolorder,
} from 'iexec/IExecOrderbookModule';
import { Workerpool } from 'iexec/IExecWorkerpoolModule';
import SmartLinkGroup from '@/components/SmartLinkGroup';
import {
  formatDateCompact,
  formatElapsedTime,
} from '@/utils/formatElapsedTime';
import { nrlcToRlc } from '@/utils/nrlcToRlc';

export function buildAccessDetails({
  access,
  dataset,
  app,
  workerpool,
}: {
  access: PublishedApporder | PublishedDatasetorder | PublishedWorkerpoolorder;
  dataset?: Dataset;
  app?: App;
  workerpool?: Workerpool;
}) {
  if (!access) return {};

  const order = access.order || {};

  return {
    ...(access.orderHash && {
      'Order Hash': (
        <SmartLinkGroup
          type="order"
          isCurrentPage={true}
          addressOrId={access.orderHash.toLowerCase()}
          label={access.orderHash.toLowerCase()}
        />
      ),
    }),
    ...('dataset' in order &&
      order.dataset && {
        Dataset: (
          <SmartLinkGroup
            type="dataset"
            addressOrId={order.dataset.toLowerCase()}
            label={dataset?.datasetName}
            showAddressOrIdAndLabel={true}
          />
        ),
      }),
    ...('datasetprice' in order &&
      order.datasetprice && {
        'Dataset Price': <span>{nrlcToRlc(order.datasetprice)}</span>,
      }),
    ...('app' in order &&
      order.app && {
        App: (
          <SmartLinkGroup
            type="app"
            addressOrId={order.app.toLowerCase()}
            label={app?.appName}
            showAddressOrIdAndLabel={true}
          />
        ),
      }),
    ...('appprice' in order &&
      order.appprice && {
        'App Price': <span>{nrlcToRlc(order.appprice)}</span>,
      }),
    ...('workerpool' in order &&
      order.workerpool && {
        Workerpool: (
          <SmartLinkGroup
            type="workerpool"
            addressOrId={order.workerpool.toLowerCase()}
            label={workerpool?.workerpoolDescription}
            showAddressOrIdAndLabel={true}
          />
        ),
      }),
    ...('workerpoolprice' in order &&
      order.workerpoolprice !== undefined && {
        'Workerpool Price': <span>{nrlcToRlc(order.workerpoolprice)}</span>,
      }),
    ...(order.volume !== undefined && {
      Volume: <span>{order.volume}</span>,
    }),
    ...(access.remaining !== undefined && {
      Remaining: <span>{access.remaining}</span>,
    }),
    ...(order.salt && { Salt: <span>{order.salt}</span> }),
    ...(order.tag && { Tag: <span>{order.tag}</span> }),
    ...('apprestrict' in order &&
      order.apprestrict && {
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
    ...('workerpoolrestrict' in order &&
      order.workerpoolrestrict && {
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
  };
}
