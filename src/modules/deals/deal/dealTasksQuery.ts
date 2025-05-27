import { graphql } from '@/graphql/gql';

export const dealTasksQuery = graphql(`
  query DealTasks($dealAddress: ID!) {
    deal(id: $dealAddress) {
      tasks(orderBy: index, orderDirection: asc) {
        taskid: id
        index
        status
        finalDeadline
      }
    }
  }
`);
