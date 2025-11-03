import { graphql } from '@/graphql/pocoBulk/gql';

export const taskDatasetsQuery = graphql(`
  query Task($taskId: ID!) {
    task(id: $taskId) {
      bulkSlice {
        datasets(first: 10, orderBy: timestamp, orderDirection: desc, skip: 0) {
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
      }
    }
  }
`);
