import { graphql } from '@/graphql/poco/gql';

export const dealTasksQuery = graphql(`
  query DealTasks(
    $dealId: ID!
    $length: Int!
    $skip: Int!
    $nextSkip: Int!
    $nextNextSkip: Int!
  ) {
    deal(id: $dealId) {
      tasks(first: $length, skip: $skip, orderBy: index, orderDirection: asc) {
        taskid: id
        index
        status
        finalDeadline
      }
      tasksHasNext: tasks(
        first: 1
        skip: $nextSkip
        orderBy: index
        orderDirection: asc
      ) {
        taskid: id
      }
      tasksHasNextNext: tasks(
        first: 1
        skip: $nextNextSkip
        orderBy: index
        orderDirection: asc
      ) {
        taskid: id
      }
    }
  }
`);
