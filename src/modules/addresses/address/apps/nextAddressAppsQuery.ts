import { graphql } from '@/graphql/gql';

export const nextAddressAppsQuery = graphql(`
  query NextAddressApps($length: Int = 20, $skip: Int = 0, $address: ID!) {
    account(id: $address) {
      address: id
      # apps
      apps(
        orderBy: timestamp
        orderDirection: desc
        first: $length
        skip: $skip
      ) {
        address: id
      }
    }
  }
`);
