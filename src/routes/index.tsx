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
    <div className="">
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
