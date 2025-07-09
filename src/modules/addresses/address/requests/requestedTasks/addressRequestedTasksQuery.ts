import { graphql } from '@/graphql/gql';

export const addressRequestedTasksQuery = graphql(`
  query AddressRequestedTasks(
    $length: Int = 20
    $skip: Int = 0
    $nextSkip: Int = 20
    $nextNextSkip: Int = 40
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
        timestamp
        status
        finalDeadline
        deal {
          dealid: id
          app {
            address: id
            name
          }
          dataset {
            address: id
            name
          }
          workerpool {
            address: id
            description
          }
        }
      }
      taskRequesterHasNext: taskRequester(
        orderBy: timestamp
        orderDirection: desc
        first: 1
        skip: $nextSkip
      ) {
        taskid: id
      }
      taskRequesterHasNextNext: taskRequester(
        orderBy: timestamp
        orderDirection: desc
        first: 1
        skip: $nextNextSkip
      ) {
        taskid: id
      }
    }
  }
`);
