import { graphql } from '@/graphql/gql';

export const tasksQuery = graphql(`
  query Tasks($length: Int = 20, $skip: Int = 0, $nextSkip: Int = 20, $nextNextSkip: Int = 40) {
    tasks(
      first: $length
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      taskid: id
      index
      finalDeadline
      status
      timestamp
      deal {
        requester {
          address: id
        }
        beneficiary {
          address: id
        }
        app {
          address: id
        }
        dataset {
          address: id
        }
        workerpool {
          address: id
        }
        category {
          catid: id
          workClockTimeRef
        }
      }
    }
    tasksHasNext: tasks(
      first: 1
      skip: $nextSkip
      orderBy: timestamp
      orderDirection: desc
    ) {
      taskid: id
    }
    tasksHasNextNext: tasks(
      first: 1
      skip: $nextNextSkip
      orderBy: timestamp
      orderDirection: desc
    ) {
      taskid: id
    }
  }
`);
