import { graphql } from '@/graphql/poco/gql';

export const transactionQuery = graphql(`
  query Transaction($transactionHash: ID!) {
    transaction(id: $transactionHash) {
      txHash: id
      from {
        address: id
      }
      to {
        address: id
      }
      gasLimit
      gasUsed
      gasPrice
    }
  }
`);
