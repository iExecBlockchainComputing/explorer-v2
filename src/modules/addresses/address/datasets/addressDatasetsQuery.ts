import { graphql } from '@/graphql/gql';

export const addressDatasetsQuery = graphql(`
  query AddressDatasets(
    $length: Int = 20
    $skip: Int = 0
    $nextSkip: Int = 20
    $nextNextSkip: Int = 40
    $address: ID!
  ) {
    account(id: $address) {
      address: id
      # datasets
      datasets(
        orderBy: timestamp
        orderDirection: desc
        first: $length
        skip: $skip
      ) {
        address: id
        name
        timestamp
        transfers(orderBy: timestamp, orderDirection: desc) {
          transaction {
            txHash: id
          }
        }
      }
      datasetsHasNext: datasets(
        orderBy: timestamp
        orderDirection: desc
        first: 1
        skip: $nextSkip
      ) {
        address: id
      }
      datasetsHasNextNext: datasets(
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
