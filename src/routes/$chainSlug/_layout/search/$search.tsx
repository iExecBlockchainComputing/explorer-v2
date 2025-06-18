import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/$chainSlug/_layout/search/$search')({
  loader: ({ params }) => {
    const { chainSlug, search } = params;
    console.log('$search', chainSlug, search);

    return redirect({
      to: `/${chainSlug}`,
      replace: true,
      state: {
        forwardedSearch: search,
      },
    });
  },
});
