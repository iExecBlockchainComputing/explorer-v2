import { graphql } from '@/graphql/poco/gql';

export const accessAssetsDetailsQuery = graphql(`
  query AccessAssetsDetails(
    $datasetAddress: ID!
    $appAddress: ID!
    $workerpoolAddress: ID!
    $categoryId: ID!
  ) {
    dataset(id: $datasetAddress) {
      name
    }
    app(id: $appAddress) {
      name
    }
    workerpool(id: $workerpoolAddress) {
      description
    }
    category(id: $categoryId) {
      description
      id
      name
      workClockTimeRef
    }
  }
`);
