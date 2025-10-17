import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/poco/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import WorkerpoolIcon from '@/components/icons/WorkerpoolIcon';
import { BackButton } from '@/components/ui/BackButton';
import { useTabParam } from '@/hooks/usePageParam';
import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { Tabs } from '@/modules/Tabs';
import { SearcherBar } from '@/modules/search/SearcherBar';
import { WorkerpoolDealsTable } from '@/modules/workerpools/workerpool/WorkerpoolDealsTable';
import { buildWorkerpoolDetails } from '@/modules/workerpools/workerpool/buildWorkerpoolDetails';
import { WorkerpoolAccessTable } from '@/modules/workerpools/workerpool/WorkerpoolAccessTable';
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
  const tabLabels = ['DETAILS', 'DEALS', 'ACCESS'];
  const [currentTab, setCurrentTab] = useTabParam(
    'workerpoolTab',
    tabLabels,
    0
  );
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

  const [isLoadingChild, setIsLoadingChild] = useState(false);
  const [isOutdatedChild, setIsOutdatedChild] = useState(false);

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

  const showOutdated = workerpool && (isError || isOutdatedChild);
  const showLoading = isLoading || isRefetching || isLoadingChild;

  return (
    <div className="mt-8 flex flex-col gap-6">
      <div className="mt-6 flex flex-col justify-between lg:flex-row">
        <SearcherBar className="py-6 lg:order-last lg:mr-0 lg:max-w-md lg:py-0 xl:max-w-xl" />
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 text-2xl font-extrabold">
            <WorkerpoolIcon size={24} />
            Workerpool details
            {showOutdated && (
              <span className="text-muted-foreground text-sm font-light">
                (outdated)
              </span>
            )}
            {showLoading && <LoaderCircle className="animate-spin" />}
          </h1>
          <div className="flex items-center gap-2">
            <BackButton />
            <WorkerpoolBreadcrumbs workerpoolId={workerpoolAddress} />
          </div>
        </div>
      </div>

      <Tabs
        currentTab={currentTab}
        tabLabels={tabLabels}
        onTabChange={setCurrentTab}
      />
      {currentTab === 0 &&
        (hasPastError && !workerpoolDetails ? (
          <ErrorAlert message="An error occurred during deal details loading." />
        ) : (
          <DetailsTable details={workerpoolDetails || {}} zebra={false} />
        ))}
      {currentTab === 1 && (
        <WorkerpoolDealsTable
          workerpoolAddress={workerpoolAddress}
          setLoading={setIsLoadingChild}
          setOutdated={setIsOutdatedChild}
        />
      )}
      {currentTab === 2 && (
        <WorkerpoolAccessTable
          workerpoolAddress={workerpoolAddress}
          setLoading={setIsLoadingChild}
          setOutdated={setIsOutdatedChild}
        />
      )}
    </div>
  );
}
