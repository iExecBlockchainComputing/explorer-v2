import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$chainSlug/_layout/deals')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/deals"!</div>;
}
