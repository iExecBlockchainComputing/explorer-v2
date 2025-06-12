import { graphql } from '@/graphql/gql';

export const searchQuery = graphql(`
  query Search($search: ID!) {
    app(id: $search) {
      address: id
    }
    dataset(id: $search) {
      address: id
    }
    workerpool(id: $search) {
      address: id
    }
    deal(id: $search) {
      dealid: id
    }
    task(id: $search) {
      taskid: id
    }
    account(id: $search) {
      address: id
    }
    transaction(id: $search) {
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
