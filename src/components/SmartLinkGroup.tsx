import { Link } from '@tanstack/react-router';
import { ExternalLink } from 'lucide-react';
import CopyButton from '@/components/CopyButton';
import { Button } from '@/components/ui/button';
import { truncateAddress } from '@/utils/truncateAddress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

const blockExplorerUrl = 'https://blockscout.iex.ec'; // adapte selon ton environnement

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
}

export default function SmartLinkGroup({
  type,
  addressOrId,
  label,
}: SmartLinkGroupProps) {
  const basePath = {
    deal: 'deals',
    dataset: 'datasets',
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
      <Button
        variant="link"
        className="h-auto p-0 text-sm text-orange-200"
        asChild
      >
        <Link to={`/${basePath[type]}/${addressOrId}`}>
          <span className="hidden md:inline">{label ?? addressOrId}</span>
          <span className="inline md:hidden">
            {(label ? truncateAddress(label) : '') ?? addressOrId}
          </span>
        </Link>
      </Button>

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="link"
              className="h-auto p-0! text-sm text-white"
              asChild
            >
              <a
                href={`${blockExplorerUrl}/${blockExplorerPath[type]}`}
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
