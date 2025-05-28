import { graphql } from '@/graphql/gql';

export const nextWorkerpoolDealsQuery = graphql(`
  query NextWorkerpoolDeals(
    $length: Int = 20
    $skip: Int = 0
    $workerpoolAddress: ID!
  ) {
    workerpool(id: $workerpoolAddress) {
      address: id
      deals: usages(
        first: $length
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
      ) {
        dealid: id
      }
    }
  }
`);
