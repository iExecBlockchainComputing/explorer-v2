import { graphql } from '@/graphql/dataprotector/gql';


export const datasetSchemaQuery = graphql(`
  query DatasetSchema($datasetAddress: ID!) {
    protectedData(id: $datasetAddress) {
      schema {
        path
        type
      }
    }
  }
`);

// Query optimisée en string pour utiliser avec executeDataprotector
export const optimizedProtectedDatasQueryString = graphql(`
  query OptimizedProtectedDatasWithSchemas($datasetIds: [Bytes!]!) {
    protectedDatas(where: { id_in: $datasetIds }) {
      id
      schema {
        path
        type
      }
    }
  }
`);
