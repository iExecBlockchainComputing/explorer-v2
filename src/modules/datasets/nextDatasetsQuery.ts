import { graphql } from '@/graphql/poco/gql';

export const nextDatasetsQuery = graphql(`
  query NextDatasets($length: Int = 20, $skip: Int = 0) {
    datasets(
      first: $length
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      address: id
    }
  }
`);
