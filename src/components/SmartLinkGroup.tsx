import { Link } from '@tanstack/react-router';
import { ExternalLink } from 'lucide-react';
import CopyButton from '@/components/CopyButton';
import { Button } from '@/components/ui/button';
import useUserStore from '@/stores/useUser.store';
import { getBlockExplorerUrl, getChainFromId } from '@/utils/chain.utils';
import { truncateAddress } from '@/utils/truncateAddress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

type LinkType =
  | 'deal'
  | 'dataset'
  | 'workerpool'
  | 'app'
  | 'address'
  | 'transaction';

interface SmartLinkGroupProps {
  type: LinkType;
  addressOrId: string;
  label?: string;
  isCurrentPage?: boolean;
}

export default function SmartLinkGroup({
  type,
  addressOrId,
  label,
  isCurrentPage = false,
}: SmartLinkGroupProps) {
  const { chainId } = useUserStore();
  const basePath = {
    deal: 'deals',
    dataset: 'dataset',
    workerpool: 'workerpool',
    app: 'apps',
    address: 'address',
    transaction: 'transaction',
  };

  const blockExplorerPath = {
    deal: `tx/${addressOrId}`,
    dataset: `address/${addressOrId}`,
    workerpool: `address/${addressOrId}`,
    app: `address/${addressOrId}`,
    address: `address/${addressOrId}`,
    transaction: `tx/${addressOrId}`,
  };

  return (
    <div className="content flex items-center gap-1">
      {!isCurrentPage ? (
        <Button
          variant="link"
          className="h-auto p-0 text-sm text-orange-200"
          asChild
        >
          <Link
            to={`/${getChainFromId(chainId)?.slug}/${basePath[type]}/${addressOrId}`}
          >
            <span className="hidden md:inline">{label ?? addressOrId}</span>
            <span className="inline md:hidden">
              {(label ? truncateAddress(label) : '') ?? addressOrId}
            </span>
          </Link>
        </Button>
      ) : (
        <div>
          <span className="hidden md:inline">{label ?? addressOrId}</span>
          <span className="inline md:hidden">
            {(label ? truncateAddress(label) : '') ?? addressOrId}
          </span>
        </div>
      )}

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="link"
              className="h-auto p-0! text-sm text-white"
              asChild
            >
              <a
                href={`${getBlockExplorerUrl(chainId)}/${blockExplorerPath[type]}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-sm">
            Open in Block Explorer
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <CopyButton textToCopy={addressOrId} />
    </div>
  );
}
