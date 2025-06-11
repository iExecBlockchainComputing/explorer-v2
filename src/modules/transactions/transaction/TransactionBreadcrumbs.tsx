import { ChainLink } from '@/components/ChainLink';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { truncateAddress } from '@/utils/truncateAddress';

type TransactionBreadcrumbsProps = {
  transactionId: string;
};

export function TransactionBreadcrumbs({
  transactionId,
}: TransactionBreadcrumbsProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <ChainLink to="/">Homepage</ChainLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            Transaction{' '}
            <span className="font-normal">
              {truncateAddress(transactionId)}
            </span>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
