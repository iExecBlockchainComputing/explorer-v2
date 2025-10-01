import { useNavigate, useParams } from '@tanstack/react-router';
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tableLength?: number;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  tableLength = 10,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const { chainSlug } = useParams({ from: '/$chainSlug' });
  const navigate = useNavigate();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowClick = (
    destination: string,
    event: React.MouseEvent | React.KeyboardEvent
  ) => {
    // Don't navigate if clicking on buttons, links, or other interactive elements
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.closest('button, a')
    ) {
      return;
    }

    const path =
      destination === '/'
        ? `/${chainSlug}`
        : `/${chainSlug}${destination.startsWith('/') ? destination : `/${destination}`}`;
    navigate({ to: path });
  };

  const handleRowKeyDown = (
    destination: string,
    event: React.KeyboardEvent
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleRowClick(destination, event);
    }
  };

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
        {table.getRowModel().rows.map((row) => {
          const destination = (row.original as { destination: string })
            .destination;

          return (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              className="cursor-pointer"
              tabIndex={0}
              onClick={(e) => handleRowClick(destination, e)}
              onKeyDown={(e) => handleRowKeyDown(destination, e)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
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
