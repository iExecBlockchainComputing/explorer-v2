import { graphql } from '@/graphql/poco/gql';

export const appsQuery = graphql(`
  query Apps(
    $length: Int = 20
    $skip: Int = 0
    $nextSkip: Int = 20
    $nextNextSkip: Int = 40
    $orderBy: App_orderBy = timestamp
    $orderDirection: OrderDirection = desc
    $recentFrom: BigInt = 0
  ) {
    apps(
      first: $length
      skip: $skip
      where: { lastUsageTimestamp_gte: $recentFrom }
      orderBy: $orderBy
      orderDirection: $orderDirection
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
      lastUsageTimestamp
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
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { lastUsageTimestamp_gte: $recentFrom }
    ) {
      address: id
    }
    appsHasNextNext: apps(
      first: 1
      skip: $nextNextSkip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { lastUsageTimestamp_gte: $recentFrom }
    ) {
      address: id
    }
  }
`);
