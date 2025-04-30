import { createFileRoute } from '@tanstack/react-router';
import AppsTable from '@/modules/apps/AppsTable/AppsTable';

export const Route = createFileRoute('/apps/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mt-8">
      <AppsTable />
    </div>
  );
}
