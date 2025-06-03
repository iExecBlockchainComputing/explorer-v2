import { graphql } from '@/graphql/gql';

export const transactionQuery = graphql(`
  query Transaction($transactionAddress: ID!) {
    transaction(id: $transactionAddress) {
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
