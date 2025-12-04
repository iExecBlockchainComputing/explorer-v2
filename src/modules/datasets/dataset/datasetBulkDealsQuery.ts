import { graphql } from '@/graphql/poco/gql';

export const datasetBulkDealsQuery = graphql(`
  query DatasetBulkDeals(
    $datasetId: ID!
    $length: Int!
    $skip: Int!
    $nextSkip: Int!
    $nextNextSkip: Int!
  ) {
    bulkSliceice(
      first: $length
      skip: $skip
      where: { datasets_: { id: $datasetId } }
      orderBy: task__timestamp
      orderDirection: desc
    ) {
      task {
        deal {
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
          bulk {
            id
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
    bulkSliceiceHasNext: bulkSliceice(
      first: 1
      skip: $nextSkip
      where: { datasets_: { id: $datasetId } }
      orderBy: task__timestamp
      orderDirection: desc
    ) {
      task {
        deal {
          id
        }
      }
    }
    bulkSliceiceHasNextNext: bulkSliceice(
      first: 1
      skip: $nextNextSkip
      where: { datasets_: { id: $datasetId } }
      orderBy: task__timestamp
      orderDirection: desc
    ) {
      task {
        deal {
          id
        }
      }
    }
  }
`);
