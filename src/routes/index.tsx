import { createFileRoute } from '@tanstack/react-router';
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
    <div className="mt-8 flex flex-col items-center gap-20">
      <div className="radial-bg before:bg-grey-800 border-secondary relative z-0 h-80 w-full max-w-[1408px] overflow-hidden rounded-2xl border">
        <div className="absolute inset-0 -z-10 blur-2xl sm:blur-[100px] lg:blur-[150px]">
          <div className="absolute top-3/4 right-0 aspect-[23/30] w-1/2 rounded-full bg-orange-400/40" />
          <div className="absolute top-0 right-0 hidden aspect-square h-full translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-100/50 sm:block" />
        </div>
      </div>
      <div className="grid grid-cols-6 gap-x-6 gap-y-10">
        <div className="col-span-3">
          <DealsPreviewTable />
        </div>
        <div className="col-span-3">
          <TasksPreviewTable />
        </div>
        <div className="col-span-2">
          <AppsPreviewTable />
        </div>
        <div className="col-span-2">
          <DatasetsPreviewTable />
        </div>
        <div className="col-span-2">
          <WorkerpoolsPreviewTable />
        </div>
      </div>
    </div>
  );
}
