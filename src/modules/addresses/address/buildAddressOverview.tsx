import { AddressQuery } from '@/graphql/graphql';
import SmartLinkGroup from '@/components/SmartLinkGroup';

export function buildAddressOverview({
  address,
}: {
  address: AddressQuery['account'];
}) {
  return {
    ...(address?.address && {
      Address: (
        <SmartLinkGroup
          type={'address'}
          addressOrId={address.address}
          isCurrentPage={true}
        />
      ),
    }),
    ...(address?.allDatasets && {
      Stacked: <p>{address.staked}</p>,
    }),
    ...(address?.allWorkerpools && {
      Locked: <p>{address.locked}</p>,
    }),
  };
}
