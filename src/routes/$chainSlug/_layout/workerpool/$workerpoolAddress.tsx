import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Box, LoaderCircle } from 'lucide-react';
import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { SearcherBar } from '@/modules/SearcherBar';
import { WorkerpoolDealsTable } from '@/modules/workerpools/workerpool/WorkerpoolDealsTable';
import { buildWorkerpoolDetails } from '@/modules/workerpools/workerpool/buildWorkerpoolDetails';
import { WorkerpoolBreadcrumbs } from '@/modules/workerpools/workerpool/workerpoolBreadcrumbs';
import { workerpoolQuery } from '@/modules/workerpools/workerpool/workerpoolQuery';
import useUserStore from '@/stores/useUser.store';

export const Route = createFileRoute(
  '/$chainSlug/_layout/workerpool/$workerpoolAddress'
)({
  component: WorkerpoolsRoute,
});

function useWorkerpoolData(workerpoolAddress: string, chainId: number) {
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey: ['workerpool', workerpoolAddress],
      queryFn: () =>
        execute(workerpoolQuery, chainId, {
          length: TABLE_LENGTH,
          workerpoolAddress,
          workerpoolAddressString: workerpoolAddress,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: keepPreviousData,
    }
  );

  return {
    data: data?.workerpool,
    isLoading,
    isRefetching,
    isError,
    hasPastError: isError || errorUpdateCount > 0,
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
  } = useWorkerpoolData(workerpoolAddress, chainId!);

  const workerpoolDetails = workerpool
    ? buildWorkerpoolDetails({ workerpool })
    : undefined;

  return (
    <div className="mt-8 flex flex-col gap-6">
      <SearcherBar className="py-10" />

      <h1 className="flex items-center gap-2 text-2xl font-extrabold">
        <Box size="20" />
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
      <WorkerpoolBreadcrumbs workerpoolId={workerpoolAddress} />
      <div className="space-y-10">
        {hasPastError && !workerpoolDetails ? (
          <ErrorAlert message="An error occurred during deal details  loading." />
        ) : (
          <DetailsTable details={workerpoolDetails} zebra={false} />
        )}
        <WorkerpoolDealsTable workerpoolAddress={workerpoolAddress} />
      </div>
    </div>
  );
}
