import { graphql } from '@/graphql/gql';

export const addressBeneficiaryDealsQuery = graphql(`
  query AddressBeneficiaryDeals(
    $length: Int = 20
    $skip: Int = 0
    $address: ID!
  ) {
    account(id: $address) {
      address: id
      dealBeneficiary(
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
    }
  }
`);
