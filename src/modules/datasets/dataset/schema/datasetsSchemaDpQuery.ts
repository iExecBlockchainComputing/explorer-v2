import { graphql } from '@/graphql/dataprotector/gql';

export const datasetsSchemaQuery = graphql(`
  query datasetsSchema($datasetIds: [Bytes!]!) {
    protectedDatas(where: { id_in: $datasetIds }) {
      address: id
      schema {
        path
        type
      }
    }
  }
`);
