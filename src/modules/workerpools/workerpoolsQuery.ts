import { graphql } from '@/graphql/poco/gql';

// @ts-expect-error Updated query; regenerate codegen
export const workerpoolsQuery = graphql(`
  query Workerpools(
    $length: Int = 20
    $skip: Int = 0
    $nextSkip: Int = 20
    $nextNextSkip: Int = 40
    $orderBy: Workerpool_orderBy = timestamp
    $orderDirection: OrderDirection = desc
    $recentFrom: BigInt = 0
  ) {
    workerpools(
      first: $length
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { lastUsageTimestamp_gte: $recentFrom }
    ) {
      address: id
      owner {
        address: id
      }
      timestamp
      lastUsageTimestamp
      description
      workerStakeRatio
      schedulerRewardRatio
      usageCount
      transfers(orderBy: timestamp, orderDirection: desc) {
        transaction {
          txHash: id
          timestamp
          blockNumber
        }
      }
    }
    workerpoolsHasNext: workerpools(
      first: 1
      skip: $nextSkip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { lastUsageTimestamp_gte: $recentFrom }
    ) {
      address: id
    }
    workerpoolsHasNextNext: workerpools(
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
