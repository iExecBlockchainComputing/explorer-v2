import { graphql } from '@/graphql/gql';

export const datasetQuery = graphql(`
  query Dataset($datasetAddress: ID!, $datasetAddressString: String!) {
    dataset(id: $datasetAddress) {
      address: id
      name
      owner {
        address: id
      }
      multiaddr
      checksum
      transfers(
        where: { dataset: $datasetAddressString }
        orderBy: timestamp
        orderDirection: asc
      ) {
        dataset {
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
