import { graphql } from '@/graphql/gql';

export const nextAddressRequestedTasksQuery = graphql(`
  query NextAddressRequestedTasks(
    $length: Int = 20
    $skip: Int = 0
    $address: ID!
  ) {
    account(id: $address) {
      address: id
      taskRequester(
        orderBy: timestamp
        orderDirection: desc
        first: $length
        skip: $skip
      ) {
        taskid: id
      }
    }
  }
`);
