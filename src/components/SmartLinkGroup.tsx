import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ExternalLink } from 'lucide-react';
import CopyButton from '@/components/CopyButton';
import { Button } from '@/components/ui/button';
import { getIExec, getReadonlyIExec } from '@/externals/iexecSdkClient';
import useUserStore from '@/stores/useUser.store';
import { isValidAddress } from '@/utils/addressOrIdCheck';
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
  const { chainId, isConnected } = useUserStore();
  const basePath = {
    deal: 'deal',
    task: 'task',
    dataset: 'dataset',
    workerpool: 'workerpool',
    app: 'app',
    address: 'address',
    transaction: 'tx',
  };

  const { data: ens } = useQuery({
    queryKey: ['ens', addressOrId],
    queryFn: async () => {
      const iexec = isConnected ? await getIExec() : getReadonlyIExec(chainId!);
      const resolved = await iexec.ens.lookupAddress(addressOrId);
      if (!resolved) {
        return null;
      }
      return resolved;
    },
    enabled: !!chainId && isValidAddress(addressOrId),
    staleTime: Infinity,
  });

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
          className="h-auto gap-1 p-0 text-sm"
          asChild
        >
          <Link
            to={`/${getChainFromId(chainId)?.slug}/${basePath[type]}/${addressOrId}`}
          >
            <span className="hidden md:inline">{label ?? addressOrId}</span>
            <span className="inline md:hidden">
              {(label ? truncateAddress(label) : '') ?? addressOrId}
            </span>
            {ens ? `(${ens})` : ''}
          </Link>
        </Button>
      ) : (
        <div>
          <span className="hidden md:inline">{label ?? addressOrId}</span>
          <span className="inline md:hidden">
            {(label ? truncateAddress(label) : '') ?? addressOrId}
          </span>
          {ens ? `(${ens})` : ''}
        </div>
      )}

      {type !== 'task' && (
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
