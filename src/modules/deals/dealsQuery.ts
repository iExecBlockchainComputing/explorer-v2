import { graphql } from '@/graphql/gql';

export const dealsQuery = graphql(`
  query Deals($length: Int = 20, $skip: Int = 0) {
    deals(
      first: $length
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      dealid: id
      timestamp
      requester {
        address: id
      }
      beneficiary {
        address: id
      }
      callback {
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
      startTime
      appPrice
      datasetPrice
      workerpoolPrice
      botSize
      trust
      completedTasksCount
      claimedTasksCount
    }
  }
`);
