import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import TransactionIcon from '@/components/icons/transactionIcon';
import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { SearcherBar } from '@/modules/search/SearcherBar';
import { TransactionBreadcrumbs } from '@/modules/transactions/transaction/TransactionBreadcrumbs';
import { buildTransactionDetails } from '@/modules/transactions/transaction/buildTransactionDetails';
import { transactionEventQuery } from '@/modules/transactions/transaction/transactionEventQuery';
import { transactionQuery } from '@/modules/transactions/transaction/transactionQuery';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

export const Route = createFileRoute('/$chainSlug/_layout/tx/$txAddress')({
  component: TransactionsRoute,
});

function useTransactionData(transactionAddress: string, chainId: number) {
  const queryKey = [chainId, 'transaction', transactionAddress];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: async () => {
        const transactionData = await execute(transactionQuery, chainId, {
          length: TABLE_LENGTH,
          transactionAddress,
        });
        const transactionEventData = await execute(
          transactionEventQuery,
          chainId,
          {
            length: TABLE_LENGTH,
            transactionAddress,
          }
        );

        const allEvents = Object.values(transactionEventData).flat();

        const transaction = {
          ...transactionData.transaction,
          events: allEvents,
        };
        return { transaction };
      },
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  return {
    data: data?.transaction,
    isLoading,
    isRefetching,
    isError,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

function TransactionsRoute() {
  const { chainId, isConnected } = useUserStore();
  const { txAddress } = Route.useParams();
  const {
    data: transaction,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
  } = useTransactionData(txAddress, chainId!);

  const transactionDetails = transaction
    ? buildTransactionDetails({ transaction, isConnected })
    : undefined;

  return (
    <div className="mt-8 flex flex-col gap-6">
      <SearcherBar className="py-10" />

      <div className="space-y-2">
        <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
          <TransactionIcon size={24} />
          Transaction details
          {!transaction && isError && (
            <span className="text-muted-foreground text-sm font-light">
              (outdated)
            </span>
          )}
          {(isLoading || isRefetching) && (
            <LoaderCircle className="animate-spin" />
          )}
        </h1>
        <TransactionBreadcrumbs transactionId={txAddress} />
      </div>

      {hasPastError && !transactionDetails ? (
        <ErrorAlert message="An error occurred during transaction details  loading." />
      ) : (
        <DetailsTable details={transactionDetails} />
      )}
    </div>
  );
}
