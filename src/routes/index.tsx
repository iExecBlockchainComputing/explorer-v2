import { SUPPORTED_CHAINS } from '@/config';
import { createFileRoute } from '@tanstack/react-router';
import { SearcherBar } from '@/modules/SearcherBar';
import { AppsPreviewTable } from '@/modules/apps/AppsPreviewTable';
import { DatasetsPreviewTable } from '@/modules/datasets/DatasetsPreviewTable';
import { DealsPreviewTable } from '@/modules/deals/DealsPreviewTable';
import { TasksPreviewTable } from '@/modules/tasks/TasksPreviewTable';
import { WorkerpoolsPreviewTable } from '@/modules/workerpools/WorkerpoolsPreviewTable';
import useUserStore from '@/stores/useUser.store';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { chainId } = useUserStore();
  const currentChain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId);

  return (
    <div className="mt-8 flex flex-col gap-10 sm:gap-20">
      <div className="radial-bg sm:before:bg-grey-800 border-secondary relative z-0 mx-auto w-full max-w-[1408px] overflow-hidden rounded-2xl pt-10 sm:h-80 sm:border sm:px-12 sm:pt-20">
        <SearcherBar />
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
        <DealsPreviewTable className="lg:col-span-7" />
        <TasksPreviewTable className="lg:col-span-5" />
        <AppsPreviewTable className="lg:col-span-4" />
        <DatasetsPreviewTable className="lg:col-span-4" />
        <WorkerpoolsPreviewTable className="lg:col-span-4" />{' '}
      </div>
    </div>
  );
}
