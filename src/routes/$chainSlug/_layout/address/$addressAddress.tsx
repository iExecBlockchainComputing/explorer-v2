import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/$chainSlug/_layout/address/$addressAddress',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$chainSlug/_layout/address/$addressAddress"!</div>
}
