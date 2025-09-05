import { graphql } from '@/graphql/poco/gql';

export const workerpoolQuery = graphql(`
  query Workerpool($workerpoolAddress: ID!, $workerpoolAddressString: String!) {
    workerpool(id: $workerpoolAddress) {
      address: id
      owner {
        address: id
      }
      description
      transfers(
        where: { workerpool: $workerpoolAddressString }
        orderBy: timestamp
        orderDirection: asc
      ) {
        workerpool {
          address: id
        }
        from {
          address: id
        }
        to {
          address: id
        }
        transaction {
          txHash: id
          timestamp
          blockNumber
        }
      }
    }
  }
`);
