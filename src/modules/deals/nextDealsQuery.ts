import { graphql } from '@/graphql/poco/gql';

export const nextDealsQuery = graphql(`
  query NextDeals($length: Int = 20, $skip: Int = 0) {
    deals(
      first: $length
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      dealid: id
    }
  }
`);
