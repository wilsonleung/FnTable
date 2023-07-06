import { ColumnDef, ColumnHelper, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React, { useMemo } from "react";

import './FnTable.css';

export interface FnColumn<T> {
  width?: number;
  header?: string;
  key?: keyof T & string;
  alignment?: 'left' | 'right' | 'center'
}

export interface FnTableProps<T> {
  data: T[];
  columnsFn: (column: ColumnHelper<T>) => ColumnDef<T, any>[];
  showFooter?: boolean;
  defaultColumn?: FnColumn<T>;
  columns?: FnColumn<T>[];
}


function FnTable<T extends object>({ data, columnsFn, showFooter = false, defaultColumn, columns }: React.PropsWithChildren<FnTableProps<T>>) {

  const helper = createColumnHelper<T>();

  const cols: ColumnDef<T, any>[] = [];

  if (columns) {
    columns.forEach(col => {
      cols.push(
        helper.accessor((row) => {
          if (col.key && col.key in row) {
            return row[col.key];
          }
          return '';
        }, {
          id: col.key || '',
          header: col.header,
          size: col.width,
        })
      )
    })
  }


  const table = useReactTable<T>({
    data,
    columns: cols,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: { size: defaultColumn?.width, meta: { align: defaultColumn?.alignment } }
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
    {showFooter &&
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
