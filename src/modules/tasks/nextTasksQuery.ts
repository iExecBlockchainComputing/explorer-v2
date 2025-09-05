import { graphql } from '@/graphql/poco/gql';

export const nextTasksQuery = graphql(`
  query NextTasks($length: Int = 20, $skip: Int = 0) {
    tasks(
      first: $length
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      taskid: id
    }
  }
`);
