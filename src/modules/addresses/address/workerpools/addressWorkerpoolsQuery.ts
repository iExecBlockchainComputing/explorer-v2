import { graphql } from '@/graphql/poco/gql';

export const addressWorkerpoolsQuery = graphql(`
  query AddressWorkerpools(
    $length: Int = 20
    $skip: Int = 0
    $nextSkip: Int = 20
    $nextNextSkip: Int = 40
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
        description
        timestamp
        transfers(orderBy: timestamp, orderDirection: desc) {
          transaction {
            txHash: id
          }
        }
      }
      workerpoolsHasNext: workerpools(
        orderBy: timestamp
        orderDirection: desc
        first: 1
        skip: $nextSkip
      ) {
        address: id
      }
      workerpoolsHasNextNext: workerpools(
        orderBy: timestamp
        orderDirection: desc
        first: 1
        skip: $nextNextSkip
      ) {
        address: id
      }
    }
  }
`);
