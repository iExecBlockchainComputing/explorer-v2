import { graphql } from '@/graphql/gql';

export const addressQuery = graphql(`
  query Address($address: ID!) {
    account(id: $address) {
      address: id
      staked: balance
      locked: frozen
      score
      allApps: apps(first: 1000) {
        id
      }
      allDatasets: datasets(first: 1000) {
        id
      }
      allWorkerpools: workerpools(first: 1000) {
        id
      }
      allContributions: contributions(first: 1000) {
        id
      }
      allDealRequester: dealRequester(first: 1000) {
        id
      }
      allDealBeneficiary: dealBeneficiary(first: 1000) {
        id
      }
    }
  }
`);
