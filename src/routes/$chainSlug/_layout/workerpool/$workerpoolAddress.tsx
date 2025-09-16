import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import WorkerpoolIcon from '@/components/icons/WorkerpoolIcon';
import { BackButton } from '@/components/ui/BackButton';
import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { SearcherBar } from '@/modules/search/SearcherBar';
import { WorkerpoolDealsTable } from '@/modules/workerpools/workerpool/WorkerpoolDealsTable';
import { buildWorkerpoolDetails } from '@/modules/workerpools/workerpool/buildWorkerpoolDetails';
import { WorkerpoolBreadcrumbs } from '@/modules/workerpools/workerpool/workerpoolBreadcrumbs';
import { workerpoolQuery } from '@/modules/workerpools/workerpool/workerpoolQuery';
import useUserStore from '@/stores/useUser.store';
import { NotFoundError } from '@/utils/NotFoundError';
import { isValidAddress } from '@/utils/addressOrIdCheck';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

export const Route = createFileRoute(
  '/$chainSlug/_layout/workerpool/$workerpoolAddress'
)({
  component: WorkerpoolsRoute,
});

function useWorkerpoolData(workerpoolAddress: string, chainId: number) {
  const isValid = isValidAddress(workerpoolAddress);
  const queryKey = [chainId, 'workerpool', workerpoolAddress];
  const { data, isLoading, isRefetching, isError, error, errorUpdateCount } =
    useQuery({
      queryKey,
      enabled: !!chainId && isValid,
      queryFn: async () => {
        const result = await execute(workerpoolQuery, chainId, {
          length: TABLE_LENGTH,
          workerpoolAddress,
          workerpoolAddressString: workerpoolAddress,
        });
        if (!result?.workerpool) {
          throw new NotFoundError();
        }
        return result;
      },
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    });

  return {
    data: data?.workerpool,
    isLoading,
    isRefetching,
    isError,
    error,
    hasPastError: isError || errorUpdateCount > 0,
    isValid,
  };
}

function WorkerpoolsRoute() {
  const { chainId } = useUserStore();
  const { workerpoolAddress } = Route.useParams();
  const {
    data: workerpool,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
    isValid,
    error,
  } = useWorkerpoolData((workerpoolAddress as string).toLowerCase(), chainId!);

  const workerpoolDetails = workerpool
    ? buildWorkerpoolDetails({ workerpool })
    : undefined;

  if (!isValid) {
    return (
      <ErrorAlert className="my-16" message="Invalid workerpool address." />
    );
  }

  if (isError && error instanceof NotFoundError) {
    return <ErrorAlert className="my-16" message="Workerpool not found." />;
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      <SearcherBar className="py-6" />

      <div className="space-y-2">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          <WorkerpoolIcon size={24} />
          Workerpool details
          {workerpool && isError && (
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
          <WorkerpoolBreadcrumbs workerpoolId={workerpoolAddress} />
        </div>
      </div>

      <div className="space-y-10">
        {hasPastError && !workerpoolDetails ? (
          <ErrorAlert message="An error occurred during deal details loading." />
        ) : (
          <DetailsTable details={workerpoolDetails || {}} zebra={false} />
        )}
        <WorkerpoolDealsTable workerpoolAddress={workerpoolAddress} />
      </div>
    </div>
  );
}
