import { graphql } from '@/graphql/gql';

export const addressContributionQuery = graphql(`
  query AddressContribution($length: Int = 20, $skip: Int = 0, $address: ID!) {
    account(id: $address) {
      address: id
      # worker contributions
      contributions(
        orderBy: timestamp
        orderDirection: desc
        first: $length
        skip: $skip
      ) {
        id
        timestamp
        task {
          taskid: id
        }
        status
      }
    }
  }
`);
