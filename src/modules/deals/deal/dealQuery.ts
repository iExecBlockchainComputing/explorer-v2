import { graphql } from '@/graphql/gql';

export const dealQuery = graphql(`
  query Deal($dealId: ID!) {
    deal(id: $dealId) {
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
      dealEvents: events(orderBy: timestamp, orderDirection: asc) {
        timestamp
        id
        type: __typename
        transaction {
          txHash: id
        }
      }
    }
  }
`);
