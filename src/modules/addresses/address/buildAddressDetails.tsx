import { AddressQuery } from '@/graphql/graphql';

export function buildAddressDetails({
  address,
}: {
  address: AddressQuery['account'];
}) {
  return {
    ...(address?.allApps && {
      Apps: <p>{address.allApps.length}</p>,
    }),
    ...(address?.allDatasets && {
      Datasets: <p>{address.allDatasets.length}</p>,
    }),
    ...(address?.allWorkerpools && {
      Workerpools: <p>{address.allWorkerpools.length}</p>,
    }),
    ...(address?.allContributions && {
      Contributions: <p>{address.allContributions.length}</p>,
    }),
    ...(address?.score && {
      Score: <p>{address.score}</p>,
    }),
  };
}
