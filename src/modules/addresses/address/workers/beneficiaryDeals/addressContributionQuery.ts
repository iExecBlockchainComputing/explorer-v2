import { graphql } from '@/graphql/gql';

export const addressContributionQuery = graphql(`
  query AddressContribution($length: Int = 20, $skip: Int = 0, $nextSkip: Int = 20, $nextNextSkip: Int = 40, $address: ID!) {
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
      contributionsHasNext: contributions(
        orderBy: timestamp
        orderDirection: desc
        first: 1
        skip: $nextSkip
      ) {
        id
      }
      contributionsHasNextNext: contributions(
        orderBy: timestamp
        orderDirection: desc
        first: 1
        skip: $nextNextSkip
      ) {
        id
      }
    }
  }
`);
