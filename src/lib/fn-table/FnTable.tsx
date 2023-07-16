import { CellContext, ColumnDef, OnChangeFn, RowSelectionState, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React, { useCallback, useMemo, useState } from "react";

import './FnTable.css';
import MultiSelectCellRenderer from "./display-columns/MultiSelectCellRenderer";
import SingleSelectCellRenderer from "./display-columns/SingleSelectCellRenderer";

export interface FnColumn<T> {
  width?: number;
  header?: string;
  key?: keyof T & string;
  alignment?: 'left' | 'right' | 'center';
  cellRenderer?: (getValue: () => any) => any;
}

export interface FnTableProps<T> {
  data: T[];
  showFooter?: boolean;
  defaultColumn?: FnColumn<T>;
  columns?: FnColumn<T>[];
  showSequence?: boolean;
  selectionMode?: 'multiple' | 'single';
}


function FnTable<T extends object>({ data, showSequence = false, selectionMode, showFooter = false, defaultColumn, columns }: React.PropsWithChildren<FnTableProps<T>>) {

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const helper = createColumnHelper<T>();

  const cols: ColumnDef<T, any>[] = [];

  if (showSequence) {
    cols.push(helper.display({
      id: '__seq__',
      header: "#",
      cell: (props) => props.row.index + 1,
      size: 60
    }))
  }

  if (selectionMode === 'multiple') {
    cols.push(helper.display({
      id: '__select__',
      header: ({ table }) => <MultiSelectCellRenderer
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />,
      cell: ({ row }) => <MultiSelectCellRenderer
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />,
      size: 30,
    }))
  }

  if (selectionMode === 'single') {
    cols.push(helper.display({
      id: '__select__',
      cell: ({ row }) => <SingleSelectCellRenderer
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />,
      size: 30,
    }))

  }


  if (columns) {
    columns.forEach(col => {
      const meta = col.alignment ? { align: col.alignment } : undefined;
      //let cell = col.cellRenderer ? (info: CellContext<T, unknown>) => col.cellRenderer(info.getValue) : (info: CellContext<T, any>) => info.getValue();
      let cell = (info: CellContext<T, any>) => info.getValue();
      if (typeof col.cellRenderer === 'function') {
        cell = (info: CellContext<T, any>) => col.cellRenderer!(info.getValue);
      }

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
          cell,
          meta
        })
      )
    })
  }


  const table = useReactTable<T>({
    data,
    columns: cols,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: { size: defaultColumn?.width, meta: { align: defaultColumn?.alignment } },
    enableRowSelection: selectionMode === 'multiple' || selectionMode === 'single',
    enableMultiRowSelection: selectionMode === 'multiple'
  })

  console.log('xxx', table.getSelectedRowModel().rows);

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
            <td key={cell.id} style={{
              textAlign: (cell.column.columnDef.meta as any)?.align || 'left'
            }}>
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
