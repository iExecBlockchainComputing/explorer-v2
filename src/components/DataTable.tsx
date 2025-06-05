import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChainLink } from './ChainLink';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tableLength?: number;
  isLoading?: boolean;
}

export function DataTable<TData extends { destination: string }, TValue>({
  columns,
  data,
  tableLength = 10,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                <ChainLink to={cell.row.original.destination}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </ChainLink>
              </TableCell>
            ))}
          </TableRow>
        ))}
        {data.length === 0 && !isLoading && (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              <span>No results.</span>
            </TableCell>
          </TableRow>
        )}
        {Array.from({
          length:
            tableLength -
            data.length -
            (data.length === 0 && !isLoading ? 1 : 0),
        }).map((_, index) => (
          <TableRow key={`empty-${index}`}>
            {columns.map((_, colIndex) => (
              <TableCell key={colIndex} className="h-17">
                &nbsp;
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
