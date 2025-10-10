import { Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type DealDetailsTableProps = {
  details: Record<string, React.ReactNode | React.ReactNode[]>;
  zebra?: boolean;
};

export function DetailsTable({ details, zebra = true }: DealDetailsTableProps) {
  if (!details || Object.keys(details).length === 0) {
    return <p className="text-muted-foreground">No details available</p>;
  }
  return (
    <Table>
      <TableBody zebra={zebra}>
        {Object.entries(details).map(([key, value], i) => {
          // Si value est un objet avec .tooltip et .value
          const hasTooltip =
            value &&
            typeof value === 'object' &&
            'tooltip' in value &&
            'value' in value;
          return (
            <TableRow key={i}>
              <TableCell className="min-w-32 text-pretty! whitespace-normal">
                <span className="flex items-center gap-1">
                  {hasTooltip && (
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex items-center gap-1">
                            <Info size={14} />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-sm">
                          {(value as { tooltip: React.ReactNode }).tooltip}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <span>{key}</span>
                </span>
              </TableCell>
              <TableCell className="relative overflow-x-auto">
                {hasTooltip
                  ? (value.value as React.ReactNode)
                  : Array.isArray(value)
                    ? value.map((v, j) => <div key={j}>{v}</div>)
                    : (value as React.ReactNode)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
