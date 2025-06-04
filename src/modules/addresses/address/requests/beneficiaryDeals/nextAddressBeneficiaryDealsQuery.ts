import { graphql } from '@/graphql/gql';

export const nextAddressBeneficiaryDealsQuery = graphql(`
  query NextAddressBeneficiaryDeals(
    $length: Int = 20
    $skip: Int = 0
    $address: ID!
  ) {
    account(id: $address) {
      address: id
      dealBeneficiary(
        orderBy: timestamp
        orderDirection: desc
        first: $length
        skip: $skip
      ) {
        dealid: id
      }
    }
  }
`);
