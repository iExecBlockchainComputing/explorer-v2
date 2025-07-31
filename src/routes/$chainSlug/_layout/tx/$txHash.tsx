import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import TransactionIcon from '@/components/icons/TransactionIcon';
import { BackButton } from '@/components/ui/BackButton';
import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { SearcherBar } from '@/modules/search/SearcherBar';
import { TransactionBreadcrumbs } from '@/modules/transactions/transaction/TransactionBreadcrumbs';
import { buildTransactionDetails } from '@/modules/transactions/transaction/buildTransactionDetails';
import { transactionEventQuery } from '@/modules/transactions/transaction/transactionEventQuery';
import { transactionQuery } from '@/modules/transactions/transaction/transactionQuery';
import useUserStore from '@/stores/useUser.store';
import { NotFoundError } from '@/utils/NotFoundError';
import { isValidId } from '@/utils/addressOrIdCheck';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

export const Route = createFileRoute('/$chainSlug/_layout/tx/$txHash')({
  component: TransactionsRoute,
});

function useTransactionData(transactionHash: string, chainId: number) {
  const isValid = isValidId(transactionHash);
  const queryKey = [chainId, 'transaction', transactionHash];
  const { data, isLoading, isRefetching, isError, error, errorUpdateCount } =
    useQuery({
      queryKey,
      enabled: !!chainId && isValid,
      queryFn: async () => {
        const transactionData = await execute(transactionQuery, chainId, {
          length: TABLE_LENGTH,
          transactionHash,
        });
        const transactionEventData = await execute(
          transactionEventQuery,
          chainId,
          {
            length: TABLE_LENGTH,
            transactionHash,
          }
        );
        const allEvents = Object.values(transactionEventData).flat();
        if (!transactionData?.transaction) {
          throw new NotFoundError();
        }
        const transaction = {
          ...transactionData.transaction,
          events: allEvents,
        };
        return { transaction };
      },
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    });

  return {
    data: data?.transaction,
    isLoading,
    isRefetching,
    isError,
    error,
    hasPastError: isError || errorUpdateCount > 0,
    isValid,
  };
}

function TransactionsRoute() {
  const { chainId } = useUserStore();
  const { txHash } = Route.useParams();
  const {
    data: transaction,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
    isValid,
    error,
  } = useTransactionData((txHash as string).toLowerCase(), chainId!);

  const transactionDetails = transaction
    ? buildTransactionDetails({ transaction })
    : undefined;

  if (!isValid) {
    return (
      <ErrorAlert className="my-16" message="Invalid transaction address." />
    );
  }

  if (isError && error instanceof NotFoundError) {
    return <ErrorAlert className="my-16" message="Transaction not found." />;
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      <SearcherBar className="py-6" />

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
        <div className="flex items-center gap-2">
          <BackButton />
          <TransactionBreadcrumbs transactionId={txHash} />
        </div>
      </div>

      {hasPastError && !transactionDetails ? (
        <ErrorAlert message="An error occurred during transaction details loading." />
      ) : (
        <DetailsTable details={transactionDetails || {}} />
      )}
    </div>
  );
}
