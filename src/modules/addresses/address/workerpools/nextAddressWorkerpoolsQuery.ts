import { graphql } from '@/graphql/gql';

export const nextAddressWorkerpoolsQuery = graphql(`
  query NextAddressWorkerpools(
    $length: Int = 20
    $skip: Int = 0
    $address: ID!
  ) {
    account(id: $address) {
      address: id
      # workerpools
      workerpools(
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
