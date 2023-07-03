import { ColumnDef, ColumnHelper, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React, { useMemo } from "react";

import './FnTable.css';

export interface FnTableProps<T> {
  data: T[];
  columnsFn: (column: ColumnHelper<T>) => ColumnDef<T, any>[];
}

function FnTable<T>({ data, columnsFn }: React.PropsWithChildren<FnTableProps<T>>) {

  const helper = createColumnHelper<T>();

  const table = useReactTable<T>({
    data,
    columns: columnsFn(helper),
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: { footer: () => null }
  })

  const tableClasses = useMemo(() => {
    const classList = ["fn-table", 'w-full'];
    return classList.join(' ');
  }, []);

  return <table className={tableClasses}>
    <thead>
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <th key={header.id} style={{
              width: (header.getSize()) + 'px',
              textAlign: (header.column.columnDef.meta as any)?.align || 'left'
            }}>
              {header.isPlaceholder
                ? null
                : flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody>
      {table.getRowModel().rows.map(row => (
        <tr key={row.id}>
          {row.getVisibleCells().map(cell => (
            <td key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
    {table.getFooterGroups().length > 0 &&
      <tfoot>
        {table.getFooterGroups().map(footerGroup => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map(header => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.footer,
                    header.getContext()
                  )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    }
  </table>
}

export default FnTable;
