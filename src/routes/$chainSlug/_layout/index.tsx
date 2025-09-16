import { createFileRoute, useSearch } from '@tanstack/react-router';
import { AppsPreviewTable } from '@/modules/apps/AppsPreviewTable';
import { DatasetsPreviewTable } from '@/modules/datasets/DatasetsPreviewTable';
import { DealsPreviewTable } from '@/modules/deals/DealsPreviewTable';
import { SearcherBar } from '@/modules/search/SearcherBar';
import { TasksPreviewTable } from '@/modules/tasks/TasksPreviewTable';
import { WorkerpoolsPreviewTable } from '@/modules/workerpools/WorkerpoolsPreviewTable';
import useUserStore from '@/stores/useUser.store';
import { getSupportedChains } from '@/utils/chain.utils';

export const Route = createFileRoute('/$chainSlug/_layout/')({
  component: Index,
});

function Index() {
  const { chainId } = useUserStore();
  const search = useSearch({ from: '/$chainSlug/_layout/' });

  const initialSearch = search?.search;

  const currentChain = getSupportedChains().find(
    (chain) => chain.id === chainId
  );

  return (
    <div className="flex flex-col gap-10 sm:mt-6 md:mt-10">
      <div className="radial-bg sm:before:bg-grey-800 border-secondary relative z-0 mx-auto w-full sm:overflow-hidden sm:rounded-2xl sm:border sm:p-16 sm:px-12">
        <h1 className="mx-auto mb-2 w-full max-w-[1024px] text-lg font-extrabold md:text-2xl">
          The iExec Protocol Explorer
        </h1>
        <SearcherBar initialSearch={initialSearch} />
        <div className="absolute inset-0 -z-10 hidden blur-2xl sm:block sm:blur-[100px] lg:blur-[150px]">
          <div
            className="absolute top-1/2 -right-1/4 aspect-[23/30] w-1/2 rounded-full xl:-right-1/5"
            style={{ backgroundColor: currentChain?.color }}
          />
          <div
            className="absolute top-0 right-0 hidden aspect-square h-1/2 translate-x-1/2 -translate-y-1/2 rounded-full md:block"
            style={{ backgroundColor: currentChain?.color }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-x-6 gap-y-10 lg:grid lg:grid-cols-12">
        <DealsPreviewTable className="3xl:col-span-7 lg:col-span-12" />
        <TasksPreviewTable className="3xl:col-span-5 lg:col-span-6" />
        <AppsPreviewTable className="3xl:col-span-4 lg:col-span-6" />
        <DatasetsPreviewTable className="3xl:col-span-4 3xl:max-h-[452px] lg:col-span-12" />
        <WorkerpoolsPreviewTable className="3xl:col-span-4 lg:col-span-12" />
      </div>
    </div>
  );
}
