import { createFileRoute } from '@tanstack/react-router';
import { SearcherBar } from '@/modules/SearcherBar';
import { AppsPreviewTable } from '@/modules/apps/AppsPreviewTable';
import { DatasetsPreviewTable } from '@/modules/datasets/DatasetsPreviewTable';
import { DealsPreviewTable } from '@/modules/deals/DealsPreviewTable';
import { TasksPreviewTable } from '@/modules/tasks/TasksPreviewTable';
import { WorkerpoolsPreviewTable } from '@/modules/workerpools/workerpoolsPreviewTable';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="mt-8 flex flex-col gap-20">
      <div className="radial-bg before:bg-grey-800 border-secondary relative z-0 mx-auto h-80 w-full max-w-[1408px] overflow-hidden rounded-2xl border pt-20">
        <SearcherBar />
        <div className="absolute inset-0 -z-10 blur-2xl sm:blur-[100px] lg:blur-[150px]">
          <div className="absolute top-3/4 right-0 aspect-[23/30] w-1/2 rounded-full bg-orange-400/40" />
          <div className="absolute top-0 right-0 hidden aspect-square h-full translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-100/50 md:block" />
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
