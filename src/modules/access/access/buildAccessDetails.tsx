import {
  PublishedApporder,
  PublishedDatasetorder,
  PublishedWorkerpoolorder,
} from 'iexec/IExecOrderbookModule';
import { zeroAddress } from 'viem';
import SmartLinkGroup from '@/components/SmartLinkGroup';
import {
  formatDateCompact,
  formatElapsedTime,
} from '@/utils/formatElapsedTime';
import { nrlcToRlc } from '@/utils/nrlcToRlc';
import RevokeAccess from './RevokeAccess';

export function buildAccessDetails({
  access,
  datasetName,
  appName,
  workerpoolDescription,
  datasetRestrictName,
  appRestrictName,
  workerpoolRestrictDescription,
  category,
  userAddress,
}: {
  access: PublishedApporder | PublishedDatasetorder | PublishedWorkerpoolorder;
  datasetName?: string;
  appName?: string;
  workerpoolDescription?: string;
  datasetRestrictName?: string;
  appRestrictName?: string;
  workerpoolRestrictDescription?: string;
  category?: { name: string; description: string; workClockTimeRef: number };
  userAddress?: string;
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
            label={datasetName}
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
            label={appName}
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
            label={workerpoolDescription}
            showAddressOrIdAndLabel={true}
          />
        ),
      }),
    ...('workerpoolprice' in order &&
      order.workerpoolprice !== undefined && {
        'Workerpool Price': <span>{nrlcToRlc(order.workerpoolprice)}</span>,
      }),
    ...(access.remaining !== undefined && {
      Remaining: (
        <span>
          {access.remaining} / {order.volume}
        </span>
      ),
    }),
    ...(order.tag && { Tag: <span>{order.tag}</span> }),
    ...(category && {
      Category: {
        tooltip: (
          <>
            Indicates execution parameters: includes a name, an optional
            description, and a reference time.
          </>
        ),
        value: (
          <p>
            {category?.name}{' '}
            {category?.description.length > 0 ? category?.description : ''} (
            {Number(category?.workClockTimeRef) * 10} sec)
          </p>
        ),
      },
    }),
    ...('trust' in order &&
      order.trust && {
        Signer: (
          <div className="space-x-2">
            <SmartLinkGroup
              type="address"
              addressOrId={access.signer.toLowerCase()}
              label={access.signer.toLowerCase()}
            />
            {userAddress &&
              access.signer?.toLowerCase() === userAddress.toLowerCase() && (
                <RevokeAccess access={access} />
              )}
          </div>
        ),
      }),
    ...('apprestrict' in order &&
      order.apprestrict && {
        'App Restrict':
          order.apprestrict === zeroAddress ? (
            <span>Not restricted</span>
          ) : (
            <SmartLinkGroup
              type="app"
              addressOrId={order.apprestrict.toLowerCase()}
              label={appRestrictName}
              showAddressOrIdAndLabel={true}
            />
          ),
      }),
    ...(order.requesterrestrict && {
      'Requester Restrict':
        order.requesterrestrict === zeroAddress ? (
          <span>Not restricted</span>
        ) : (
          <SmartLinkGroup
            type="address"
            addressOrId={order.requesterrestrict.toLowerCase()}
            label={order.requesterrestrict.toLowerCase()}
          />
        ),
    }),
    ...('datasetrestrict' in order &&
      order.datasetrestrict && {
        'Dataset Restrict':
          order.datasetrestrict === zeroAddress ? (
            <span>Not restricted</span>
          ) : (
            <SmartLinkGroup
              type="address"
              addressOrId={order.datasetrestrict.toLowerCase()}
              label={datasetRestrictName}
              showAddressOrIdAndLabel={true}
            />
          ),
      }),
    ...('workerpoolrestrict' in order &&
      order.workerpoolrestrict && {
        'Workerpool Restrict':
          order.workerpoolrestrict === zeroAddress ? (
            <span>Not restricted</span>
          ) : (
            <SmartLinkGroup
              type="workerpool"
              addressOrId={order.workerpoolrestrict.toLowerCase()}
              label={workerpoolRestrictDescription}
              showAddressOrIdAndLabel={true}
            />
          ),
      }),
    ...(access.signer && {
      Signer: (
        <div className="space-x-2">
          <SmartLinkGroup
            type="address"
            addressOrId={access.signer.toLowerCase()}
            label={access.signer.toLowerCase()}
          />
          {userAddress &&
            access.signer?.toLowerCase() === userAddress.toLowerCase() && (
              <RevokeAccess access={access} />
            )}
        </div>
      ),
    }),
    ...(order.salt && { Salt: <span>{order.salt}</span> }),
    ...(order.sign && { Signature: <span>{order.sign}</span> }),
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
  };
}
