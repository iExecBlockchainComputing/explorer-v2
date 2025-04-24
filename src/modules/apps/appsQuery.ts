import { graphql } from "@/graphql/gql";

export const appsQuery = graphql(`
  query Apps($length: Int = 20, $skip: Int = 0) {
    apps(
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
      type
      multiaddr
      checksum
      mrenclave
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
