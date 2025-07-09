import { graphql } from '@/graphql/gql';

export const dealsQuery = graphql(`
  query Deals($length: Int = 20, $skip: Int = 0, $nextSkip: Int = 20, $nextNextSkip: Int = 40) {
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
    dealsHasNext: deals(
      first: 1
      skip: $nextSkip
      orderBy: timestamp
      orderDirection: desc
    ) {
      dealid: id
    }
    dealsHasNextNext: deals(
      first: 1
      skip: $nextNextSkip
      orderBy: timestamp
      orderDirection: desc
    ) {
      dealid: id
    }
  }
`);
