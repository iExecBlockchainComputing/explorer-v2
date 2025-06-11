import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

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
        {Object.entries(details).map(([key, value], i) => (
          <TableRow key={i}>
            <TableCell className="min-w-32 text-pretty! whitespace-normal">
              <p>{key} :</p>
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
