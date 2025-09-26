import { AddressQuery } from '@/graphql/poco/graphql';

function formatCount(count: number) {
  return count >= 1000 ? '1000+' : count;
}

export function buildAddressDetails({
  address,
}: {
  address: AddressQuery['account'];
}) {
  return {
    ...(address?.allApps && {
      Apps: <p>{formatCount(address.allApps.length)}</p>,
    }),
    ...(address?.allDatasets && {
      Datasets: <p>{formatCount(address.allDatasets.length)}</p>,
    }),
    ...(address?.allWorkerpools && {
      Workerpools: <p>{formatCount(address.allWorkerpools.length)}</p>,
    }),
    ...(address?.allContributions && {
      Contributions: <p>{formatCount(address.allContributions.length)}</p>,
    }),
    ...(address?.score && {
      Score: <p>{address.score}</p>,
    }),
  };
}
