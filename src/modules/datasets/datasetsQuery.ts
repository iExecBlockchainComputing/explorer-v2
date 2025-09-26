import { graphql } from '@/graphql/poco/gql';

export const datasetsQuery = graphql(`
  query Datasets(
    $length: Int = 20
    $skip: Int = 0
    $nextSkip: Int = 20
    $nextNextSkip: Int = 40
  ) {
    datasets(
      first: $length
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      address: id
      owner {
        address: id
      }
      timestamp
      name
      transfers(orderBy: timestamp, orderDirection: desc) {
        transaction {
          txHash: id
          timestamp
          blockNumber
        }
      }
    }
    datasetsHasNext: datasets(
      first: 1
      skip: $nextSkip
      orderBy: timestamp
      orderDirection: desc
    ) {
      address: id
    }
    datasetsHasNextNext: datasets(
      first: 1
      skip: $nextNextSkip
      orderBy: timestamp
      orderDirection: desc
    ) {
      address: id
    }
  }
`);
