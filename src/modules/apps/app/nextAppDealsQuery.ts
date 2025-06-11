import { graphql } from '@/graphql/gql';

export const nextAppDealsQuery = graphql(`
  query NextAppDeals($length: Int = 20, $skip: Int = 0, $appAddress: ID!) {
    app(id: $appAddress) {
      address: id
      deals: usages(
        orderBy: timestamp
        orderDirection: desc
        first: $length
        skip: $skip
      ) {
        dealid: id
      }
    }
  }
`);
