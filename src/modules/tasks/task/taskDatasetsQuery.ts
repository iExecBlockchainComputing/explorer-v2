import { graphql } from '@/graphql/poco/gql';

export const taskDatasetsQuery = graphql(`
  query TaskDatasets(
    $taskId: ID!
    $length: Int!
    $skip: Int!
    $nextSkip: Int!
    $nextNextSkip: Int!
  ) {
    task(id: $taskId) {
      bulkSlice {
        datasets(
          first: $length
          orderBy: timestamp
          orderDirection: desc
          skip: $skip
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
          orderBy: timestamp
          orderDirection: desc
          skip: $nextSkip
        ) {
          address: id
        }
        datasetsHasNextNext: datasets(
          first: 1
          orderBy: timestamp
          orderDirection: desc
          skip: $nextNextSkip
        ) {
          address: id
        }
      }
    }
  }
`);
