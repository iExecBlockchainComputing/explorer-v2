import { graphql } from '@/graphql/pocoBulk/gql';

export const datasetTasksQuery = graphql(`
  query DatasetTasks(
    $datasetId: ID!
    $length: Int!
    $skip: Int!
    $nextSkip: Int!
    $nextNextSkip: Int!
  ) {
    dataset(id: $datasetId) {
      bulkUsages(first: $length, skip: $skip) {
        task {
          taskid: id
          status
          finalDeadline
        }
      }
      bulkUsagesHasNext: bulkUsages(first: 1, skip: $nextSkip) {
        task {
          taskid: id
        }
      }
      bulkUsagesHasNextNext: bulkUsages(first: 1, skip: $nextNextSkip) {
        task {
          taskid: id
        }
      }
    }
  }
`);
