import { graphql } from '@/graphql/gql';

export const datasetsQuery = graphql(`
  query Datasets($length: Int = 20, $skip: Int = 0) {
    datasets(
      first: $length
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      address: id
      owner {
        address: id
      }
      timestamp
      name
      multiaddr
      checksum
      transfers(orderBy: timestamp, orderDirection: desc) {
        transaction {
          txHash: id
          timestamp
          blockNumber
        }
      }
    }
  }
`);
