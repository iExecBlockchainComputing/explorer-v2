import { graphql } from '@/graphql/poco/gql';

export const nextWorkerpoolsQuery = graphql(`
  query NextWorkerpools($length: Int = 20, $skip: Int = 0) {
    workerpools(
      first: $length
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      address: id
    }
  }
`);
