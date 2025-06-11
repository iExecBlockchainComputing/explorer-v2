import { graphql } from '@/graphql/gql';

export const appDealsQuery = graphql(`
  query AppDeals($length: Int = 20, $skip: Int = 0, $appAddress: ID!) {
    app(id: $appAddress) {
      address: id
      deals: usages(
        orderBy: timestamp
        orderDirection: desc
        first: $length
        skip: $skip
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
  }
`);
