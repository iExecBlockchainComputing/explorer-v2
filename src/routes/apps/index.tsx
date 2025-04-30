import { createFileRoute } from '@tanstack/react-router';
import { Box } from 'lucide-react';
import { SearcherBar } from '@/modules/SearcherBar';
import AppsTable from '@/modules/apps/appsTable/AppsTable';

export const Route = createFileRoute('/apps/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mt-8 grid gap-6">
      <SearcherBar className="py-16" />
      <h1 className="flex items-center gap-2 font-sans text-2xl font-extrabold">
        <Box size="20" />
        Apps deployed
      </h1>
      <AppsTable />
    </div>
  );
}
