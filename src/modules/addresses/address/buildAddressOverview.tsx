import { AddressQuery } from '@/graphql/graphql';

export function buildAddressOverview({
  address,
}: {
  address: AddressQuery['account'];
}) {
  return {
    ...(address?.address && {
      Address: <p>{address.address}</p>,
    }),
    ...(address?.allDatasets && {
      Stacked: <p>{address.staked}</p>,
    }),
    ...(address?.allWorkerpools && {
      Locked: <p>{address.locked}</p>,
    }),
  };
}
