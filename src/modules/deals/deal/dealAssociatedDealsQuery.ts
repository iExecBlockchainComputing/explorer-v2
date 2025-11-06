import { graphql } from '@/graphql/poco/gql';

export const dealAssociatedDealsQuery = graphql(`
  query DealAssociatedDeals(
    $length: Int!
    $skip: Int!
    $nextSkip: Int!
    $dealId: ID!
  ) {
    deal(id: $dealId) {
      requestorder {
        deals(where: { id_not: $dealId }, first: $length, skip: $skip) {
          dealid: id
          timestamp
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
          beneficiary {
            address: id
          }
          callback {
            address: id
          }
          appPrice
          datasetPrice
          workerpoolPrice
          params
          tag
          trust
          category {
            catid: id
            name
            workClockTimeRef
            description
          }
          botSize
          botFirst
          completedTasksCount
          claimedTasksCount
          requester {
            address: id
          }
        }
        dealsHasNext: deals(
          first: 1
          where: { id_not: $dealId }
          skip: $nextSkip
        ) {
          id
        }
      }
    }
  }
`);
