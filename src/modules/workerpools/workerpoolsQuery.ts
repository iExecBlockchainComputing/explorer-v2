import { graphql } from '@/graphql/gql'

export const workerpoolsQuery = graphql(`
  query Workerpools($length: Int = 20, $skip: Int = 0) {
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
  }
`);
