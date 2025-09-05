import { graphql } from '@/graphql/poco/gql';

export const nextAppsQuery = graphql(`
  query NextApps($length: Int = 20, $skip: Int = 0) {
    apps(
      first: $length
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      address: id
    }
  }
`);
