import { graphql } from '@/graphql/gql';

export const addressWorkerpoolsQuery = graphql(`
  query AddressWorkerpools($length: Int = 20, $skip: Int = 0, $address: ID!) {
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
    }
  }
`);
