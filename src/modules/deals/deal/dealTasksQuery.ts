import { graphql } from '@/graphql/gql';

export const dealTasksQuery = graphql(`
  query DealTasks($dealId: ID!) {
    deal(id: $dealId) {
      tasks(orderBy: index, orderDirection: asc) {
        taskid: id
        index
        status
        finalDeadline
      }
    }
  }
`);
