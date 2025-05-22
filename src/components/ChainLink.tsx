import { useParams } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { ComponentProps } from 'react';

function buildRoutePath(path: string, chainSlug: string) {
  if (path === '/') return `/${chainSlug}`;
  return `/${chainSlug}${path.startsWith('/') ? path : `/${path}`}`;
}

type ChainLinkProps = {
  to: string;
} & Omit<ComponentProps<typeof Link>, 'to'>;

export function ChainLink({ to, ...props }: ChainLinkProps) {
  const { chainSlug } = useParams({ from: '/$chainSlug' });
  const path = buildRoutePath(to, chainSlug);
  return <Link to={path} {...props} />;
}
