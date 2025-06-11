import { graphql } from '@/graphql/gql';

export const datasetDealsQuery = graphql(`
  query DatasetDeals($length: Int = 20, $skip: Int = 0, $datasetAddress: ID!) {
    dataset(id: $datasetAddress) {
      address: id
      deals: usages(
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
