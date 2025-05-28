import { graphql } from '@/graphql/gql';

export const nextDatasetDealsQuery = graphql(`
  query NextDatasetDeals(
    $length: Int = 20
    $skip: Int = 0
    $datasetAddress: ID!
  ) {
    dataset(id: $datasetAddress) {
      address: id
      deals: usages(
        first: $length
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
      ) {
        dealid: id
      }
    }
  }
`);
