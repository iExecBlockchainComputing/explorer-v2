import { graphql } from '@/graphql/gql';

export const searchQuery = graphql(`
  query Search($search: ID!) {
    app(id: $search) {
      id
    }
    dataset(id: $search) {
      id
    }
    workerpool(id: $search) {
      id
    }
    deal(id: $search) {
      id
    }
    task(id: $search) {
      id
    }
    account(id: $search) {
      id
    }
    transaction(id: $search) {
      id
    }
  }
`);
