import { graphql } from '@/graphql/dataprotector/gql';

export const datasetSchemaQuery = graphql(`
  query DatasetSchema($datasetAddress: ID!) {
    protectedData(id: $datasetAddress) {
      schema {
        path
      }
    }
  }
`); 
