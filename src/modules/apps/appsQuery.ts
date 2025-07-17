import { graphql } from '@/graphql/gql';

export const appsQuery = graphql(`
  query Apps(
    $length: Int = 20
    $skip: Int = 0
    $nextSkip: Int = 20
    $nextNextSkip: Int = 40
  ) {
    apps(
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
      type
      multiaddr
      checksum
      mrenclave
      transfers(orderBy: timestamp, orderDirection: desc) {
        transaction {
          txHash: id
          timestamp
          blockNumber
        }
      }
    }
    appsHasNext: apps(
      first: 1
      skip: $nextSkip
      orderBy: timestamp
      orderDirection: desc
    ) {
      address: id
    }
    appsHasNextNext: apps(
      first: 1
      skip: $nextNextSkip
      orderBy: timestamp
      orderDirection: desc
    ) {
      address: id
    }
  }
`);
