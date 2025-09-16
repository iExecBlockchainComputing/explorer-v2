import { graphql } from '@/graphql/poco/gql';

export const appQuery = graphql(`
  query App($appAddress: ID!, $appAddressString: String!) {
    app(id: $appAddress) {
      address: id
      name
      owner {
        address: id
      }
      multiaddr
      mrenclave
      checksum
      transfers(
        where: { app: $appAddressString }
        orderBy: timestamp
        orderDirection: asc
      ) {
        app {
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
