import { graphql } from "@/graphql/gql";

export const taskQuery = graphql(`
  query Tasks($length: Int = 20, $skip: Int = 0) {
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
  }
`);
