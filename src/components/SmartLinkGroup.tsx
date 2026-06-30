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
  | 'task'
  | 'dataset'
  | 'workerpool'
  | 'app'
  | 'address'
  | 'transaction'
  | 'order';

interface SmartLinkGroupProps {
  type: LinkType;
  addressOrId: string;
  label?: string;
  isCurrentPage?: boolean;
  showAddressOrIdAndLabel?: boolean;
}

export default function SmartLinkGroup({
  type,
  addressOrId,
  label,
  isCurrentPage = false,
  showAddressOrIdAndLabel = false,
}: SmartLinkGroupProps) {
  const { chainId } = useUserStore();
  const basePath = {
    deal: 'deal',
    task: 'task',
    dataset: 'dataset',
    workerpool: 'workerpool',
    app: 'app',
    address: 'address',
    transaction: 'tx',
    order: 'order',
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
        <Button variant="link" className="h-auto gap-1 p-0 text-sm" asChild>
          <Link
            to={`/${getChainFromId(chainId)?.slug}/${basePath[type]}/${addressOrId}`}
          >
            <span className="hidden md:inline">
              {label && !showAddressOrIdAndLabel ? label : addressOrId}
            </span>
            <span className="inline md:hidden">
              {(label
                ? truncateAddress(label)
                : truncateAddress(addressOrId)) ?? addressOrId}
            </span>
            {showAddressOrIdAndLabel && label ? `(${label})` : ''}
          </Link>
        </Button>
      ) : (
        <div>
          <span className="hidden md:inline">{label ?? addressOrId}</span>
          <span className="inline md:hidden">
            {(label ? truncateAddress(label) : truncateAddress(addressOrId)) ??
              addressOrId}
          </span>
        </div>
      )}

      {type !== 'task' && type !== 'order' && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="link" className="h-auto p-0! text-sm" asChild>
                <a
                  href={`${getBlockExplorerUrl(chainId)}/${blockExplorerPath[type]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open in Block Explorer"
                >
                  <ExternalLink className="text-foreground" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm">
              Open in Block Explorer
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <CopyButton textToCopy={addressOrId} />
    </div>
  );
}
