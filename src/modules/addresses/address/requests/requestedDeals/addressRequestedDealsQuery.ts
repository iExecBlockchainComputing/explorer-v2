import { graphql } from '@/graphql/gql';

export const addressRequestedDealsQuery = graphql(`
  query AddressRequestedDeals(
    $length: Int = 20
    $skip: Int = 0
    $nextSkip: Int = 20
    $nextNextSkip: Int = 40
    $address: ID!
  ) {
    account(id: $address) {
      address: id
      dealRequester(
        orderBy: timestamp
        orderDirection: desc
        first: $length
        skip: $skip
      ) {
        dealid: id
        timestamp
        botSize
        completedTasksCount
        claimedTasksCount
        category {
          workClockTimeRef
        }
        startTime
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
        appPrice
        datasetPrice
        workerpoolPrice
      }
      dealRequesterHasNext: dealRequester(
        orderBy: timestamp
        orderDirection: desc
        first: 1
        skip: $nextSkip
      ) {
        dealid: id
      }
      dealRequesterHasNextNext: dealRequester(
        orderBy: timestamp
        orderDirection: desc
        first: 1
        skip: $nextNextSkip
      ) {
        dealid: id
      }
    }
  }
`);
