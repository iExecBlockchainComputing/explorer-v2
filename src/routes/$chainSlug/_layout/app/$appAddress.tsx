import { TABLE_LENGTH, TABLE_REFETCH_INTERVAL } from '@/config';
import { execute } from '@/graphql/execute';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import AppIcon from '@/components/icons/appIcon';
import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { AppBreadcrumbs } from '@/modules/apps/app/AppBreadcrumbs';
import { AppDealsTable } from '@/modules/apps/app/AppDealsTable';
import { appQuery } from '@/modules/apps/app/appQuery';
import { buildAppDetails } from '@/modules/apps/app/buildAppDetails';
import { SearcherBar } from '@/modules/search/SearcherBar';
import useUserStore from '@/stores/useUser.store';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

export const Route = createFileRoute('/$chainSlug/_layout/app/$appAddress')({
  component: AppsRoute,
});

function useAppData(appAddress: string, chainId: number) {
  const queryKey = [chainId, 'app', appAddress];
  const { data, isLoading, isRefetching, isError, errorUpdateCount } = useQuery(
    {
      queryKey,
      queryFn: () =>
        execute(appQuery, chainId, {
          length: TABLE_LENGTH,
          appAddress,
          appAddressString: appAddress,
        }),
      refetchInterval: TABLE_REFETCH_INTERVAL,
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    }
  );

  return {
    data: data?.app,
    isLoading,
    isRefetching,
    isError,
    hasPastError: isError || errorUpdateCount > 0,
  };
}

function AppsRoute() {
  const { chainId } = useUserStore();
  const { appAddress } = Route.useParams();
  const {
    data: app,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
  } = useAppData(appAddress, chainId!);

  const appDetails = app ? buildAppDetails({ app }) : undefined;

  return (
    <div className="mt-8 flex flex-col gap-6">
      <SearcherBar className="py-10" />
      <div className="space-y-2">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          <AppIcon size={24} />
          App details
          {app && isError && (
            <span className="text-muted-foreground text-sm font-light">
              (outdated)
            </span>
          )}
          {(isLoading || isRefetching) && (
            <LoaderCircle className="animate-spin" />
          )}
        </h1>
        <AppBreadcrumbs appId={appAddress} />
      </div>

      <div className="space-y-10">
        {hasPastError && !appDetails ? (
          <ErrorAlert message="An error occurred during deal details  loading." />
        ) : (
          <DetailsTable details={appDetails} zebra={false} />
        )}
        <AppDealsTable appAddress={appAddress} />
      </div>
    </div>
  );
}
