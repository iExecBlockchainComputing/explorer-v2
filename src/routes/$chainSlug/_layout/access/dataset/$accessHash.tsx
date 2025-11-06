import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import AccessIcon from '@/components/icons/AccessIcon';
import { BackButton } from '@/components/ui/BackButton';
import { getIExec } from '@/externals/iexecSdkClient';
import { DetailsTable } from '@/modules/DetailsTable';
import { ErrorAlert } from '@/modules/ErrorAlert';
import { AccessBreadcrumbs } from '@/modules/access/access/AccessBreadcrumbs';
import { buildAccessDetails } from '@/modules/access/access/buildAccessDetails';
import { SearcherBar } from '@/modules/search/SearcherBar';
import useUserStore from '@/stores/useUser.store';
import { NotFoundError } from '@/utils/NotFoundError';
import { isValidId } from '@/utils/addressOrIdCheck';
import { createPlaceholderDataFnForQueryKey } from '@/utils/createPlaceholderDataFnForQueryKey';

export const Route = createFileRoute(
  '/$chainSlug/_layout/access/dataset/$accessHash'
)({
  component: DatasetAccessRoute,
});

function useAccessData(accessHash: string, chainId: number) {
  const isValid = isValidId(accessHash);
  const queryKey = [chainId, 'access', 'Dataset', accessHash];
  const { data, isLoading, isRefetching, isError, error, errorUpdateCount } =
    useQuery({
      queryKey,
      enabled: !!chainId && isValid,
      queryFn: async () => {
        const iexec = await getIExec();
        const access = await iexec.orderbook.fetchDatasetorder(accessHash);
        const { dataset } = await iexec.dataset.showDataset(
          access.order.dataset
        );
        return { access, dataset };
      },
      placeholderData: createPlaceholderDataFnForQueryKey(queryKey),
    });

  return {
    access: data?.access,
    dataset: data?.dataset,
    isLoading,
    isRefetching,
    isError,
    error,
    hasPastError: isError || errorUpdateCount > 0,
    isValid,
  };
}

function DatasetAccessRoute() {
  const { chainId, address: userAddress } = useUserStore();
  const { accessHash } = Route.useParams();
  const {
    access,
    dataset,
    isLoading,
    isRefetching,
    isError,
    hasPastError,
    isValid,
    error,
  } = useAccessData((accessHash as string).toLowerCase(), chainId!);

  const accessDetails = access
    ? buildAccessDetails({ access, dataset, userAddress })
    : undefined;

  if (!isValid) {
    return <ErrorAlert className="my-16" message="Invalid access address." />;
  }

  if (isError && error instanceof NotFoundError) {
    return <ErrorAlert className="my-16" message="Access not found." />;
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      <div className="mt-6 flex flex-col justify-between lg:flex-row">
        <SearcherBar className="py-6 lg:order-last lg:mr-0 lg:max-w-md lg:py-0 xl:max-w-xl" />
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
            <AccessIcon size={24} />
            Dataset access details
            {!access && isError && (
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
            <AccessBreadcrumbs accessHash={accessHash} />
          </div>
        </div>
      </div>

      {hasPastError && !accessDetails ? (
        <ErrorAlert message="An error occurred during access details loading." />
      ) : (
        <DetailsTable details={accessDetails || {}} />
      )}
    </div>
  );
}
