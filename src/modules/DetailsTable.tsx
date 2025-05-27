import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

type DealDetailsTableProps = {
  details: Record<string, React.ReactNode | React.ReactNode[]>;
};

export function DetailsTable({ details }: DealDetailsTableProps) {
  return (
    <Table>
      <TableBody>
        {Object.entries(details).map(([key, value], i) => (
          <TableRow key={i}>
            <TableCell className="min-w-32 text-pretty! whitespace-normal">
              {key} :
            </TableCell>
            <TableCell className="relative overflow-x-auto">
              {Array.isArray(value)
                ? value.map((v, j) => <div key={j}>{v}</div>)
                : value}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
