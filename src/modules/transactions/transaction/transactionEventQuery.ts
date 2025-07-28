import { graphql } from '@/graphql/gql';

export const transactionEventQuery = graphql(`
  query TransactionEvent($transactionHash: String!) {
    appTransfers(where: { transaction: $transactionHash }) {
      id
      type: __typename
      app {
        address: id
      }
      from {
        address: id
      }
      to {
        address: id
      }
    }
    datasetTransfers(where: { transaction: $transactionHash }) {
      id
      type: __typename
      dataset {
        address: id
      }
      from {
        address: id
      }
      to {
        address: id
      }
    }
    workerpoolTransfers(where: { transaction: $transactionHash }) {
      id
      type: __typename
      workerpool {
        address: id
      }
      from {
        address: id
      }
      to {
        address: id
      }
    }
    rewards(where: { transaction: $transactionHash }) {
      id
      type: __typename
      account {
        address: id
      }
      value
      task {
        taskid: id
      }
    }
    seizes(where: { transaction: $transactionHash }) {
      id
      type: __typename
      account {
        address: id
      }
      value
      task {
        taskid: id
      }
    }
    locks(where: { transaction: $transactionHash }) {
      id
      type: __typename
      account {
        address: id
      }
      value
    }
    unlocks(where: { transaction: $transactionHash }) {
      id
      type: __typename
      account {
        address: id
      }
      value
    }
    accurateContributions(where: { transaction: $transactionHash }) {
      id
      type: __typename
      account {
        address: id
      }
    }
    faultyContributions(where: { transaction: $transactionHash }) {
      id
      type: __typename
      account {
        address: id
      }
    }
    policyUpdates(where: { transaction: $transactionHash }) {
      id
      type: __typename
      workerpool {
        address: id
      }
    }
    ordersMatcheds(where: { transaction: $transactionHash }) {
      id
      type: __typename
      deal {
        dealid: id
      }
    }
    schedulerNotices(where: { transaction: $transactionHash }) {
      id
      type: __typename
      deal {
        dealid: id
      }
      workerpool {
        address: id
      }
    }
    taskInitializes(where: { transaction: $transactionHash }) {
      id
      type: __typename
      task {
        taskid: id
      }
    }
    taskContributes(where: { transaction: $transactionHash }) {
      id
      type: __typename
      task {
        taskid: id
      }
      worker {
        address: id
      }
    }
    taskConsensuses(where: { transaction: $transactionHash }) {
      id
      type: __typename
      task {
        taskid: id
      }
    }
    taskReveals(where: { transaction: $transactionHash }) {
      id
      type: __typename
      task {
        taskid: id
      }
    }
    taskReopens(where: { transaction: $transactionHash }) {
      id
      type: __typename
      task {
        taskid: id
      }
    }
    taskFinalizes(where: { transaction: $transactionHash }) {
      id
      type: __typename
      task {
        taskid: id
      }
    }
    taskClaimeds(where: { transaction: $transactionHash }) {
      id
      type: __typename
      task {
        taskid: id
      }
    }
  }
`);
