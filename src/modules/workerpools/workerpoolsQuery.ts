import { graphql } from '@/graphql/poco/gql';

export const workerpoolsQuery = graphql(`
  query Workerpools(
    $length: Int = 20
    $skip: Int = 0
    $nextSkip: Int = 20
    $nextNextSkip: Int = 40
  ) {
    workerpools(
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
      description
      workerStakeRatio
      schedulerRewardRatio
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
      orderBy: timestamp
      orderDirection: desc
    ) {
      address: id
    }
    workerpoolsHasNextNext: workerpools(
      first: 1
      skip: $nextNextSkip
      orderBy: timestamp
      orderDirection: desc
    ) {
      address: id
    }
  }
`);
