import {
  CellContext,
  ColumnDef,
  ColumnHelper,
  RowSelectionState,
  Updater,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Row,
} from '@tanstack/react-table';
import React, { useCallback, useMemo } from 'react';

import './FnTable.css';
import MultiSelectCellRenderer from './display-columns/MultiSelectCellRenderer';
import SingleSelectCellRenderer from './display-columns/SingleSelectCellRenderer';

type HeaderType<T> = string | ((childs: FnColumn<T>[]) => any);

type CellRendererContext<T> = { getValue: () => any; row: Row<T> };

export interface FnColumn<T> {
  width?: number;
  header?: HeaderType<T>;

  // from total typescript advanced react
  key?: keyof T | (string & NonNullable<unknown>);
  alignment?: 'left' | 'right' | 'center';
  // only left node will render cell renderer
  cellRenderer?: (context: CellRendererContext<T>) => any;
  childs?: FnColumn<T>[];
}

export interface FnTableProps<T> {
  data: T[];
  showFooter?: boolean;
  defaultColumn?: FnColumn<T>;
  columns?: FnColumn<T>[];
  showSequence?: boolean;
  selectionMode?: 'multiple' | 'single';
}

function buildHeader<T extends object>(column: FnColumn<T>) {
  let header;
  if (typeof column.header === 'function') {
    const result = column.header(column.childs || []);
    header = () => result;
  } else if (typeof column.header === 'string') {
    header = column.header;
  }

  return header;
}

function buildColumns<T extends object>(
  helper: ColumnHelper<T>,
  column: FnColumn<T>
): ColumnDef<T, any> {
  if (column.childs && column.childs.length > 0) {
    const columns = column.childs.map((col) => buildColumns(helper, col));
    return helper.group({
      id: String(column.key || ''),
      header: buildHeader(column),
      columns,
    });
  }

  const meta = column.alignment ? { align: column.alignment } : undefined;
  // let cell = col.cellRenderer ? (info: CellContext<T, unknown>) => col.cellRenderer(info.getValue) : (info: CellContext<T, any>) => info.getValue();
  let cell = (info: CellContext<T, any>) => info.getValue();
  if (typeof column.cellRenderer === 'function') {
    const fn = column.cellRenderer;
    cell = (info: CellContext<T, any>) => fn({ getValue: info.getValue, row: info.row });
  }

  return helper.accessor(
    (row: any) => {
      if (column.key && column.key in row) {
        return row[column.key];
      }
      return '';
    },
    {
      id: String(column.key || ''),
      header: buildHeader(column),
      size: column.width,
      cell,
      meta,
    }
  );
}

function FnTable<T extends object>({
  data,
  showSequence = false,
  selectionMode,
  showFooter = false,
  defaultColumn,
  columns,
}: React.PropsWithChildren<FnTableProps<T>>) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const helper = createColumnHelper<T>();

  const cols: ColumnDef<T, any>[] = [];

  if (showSequence) {
    cols.push(
      helper.display({
        id: '__seq__',
        header: '#',
        cell: (props) => props.row.index + 1,
        size: 60,
      })
    );
  }

  if (selectionMode === 'multiple') {
    cols.push(
      helper.display({
        id: '__select__',
        header: ({ table }) => (
          <MultiSelectCellRenderer
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <MultiSelectCellRenderer
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 30,
      })
    );
  }

  if (selectionMode === 'single') {
    cols.push(
      helper.display({
        id: '__select__',
        cell: ({ row }) => (
          <SingleSelectCellRenderer
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 30,
      })
    );
  }

  if (columns) {
    columns.forEach((col) => {
      cols.push(buildColumns(helper, col));
    });
  }

  const rowSelectionChangeHandler = useCallback(
    (updater: Updater<RowSelectionState>) => {
      if (typeof updater === 'function') {
        const updatedState = updater(rowSelection);
        console.log('[rowSelectionChangeHandler]', updatedState);
        setRowSelection(updatedState);
      }
    },
    [rowSelection]
  );

  const table = useReactTable<T>({
    data,
    columns: cols,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      size: defaultColumn?.width,
      meta: { align: defaultColumn?.alignment },
    },
    enableRowSelection: selectionMode === 'multiple' || selectionMode === 'single',
    enableMultiRowSelection: selectionMode === 'multiple',
    state: {
      rowSelection,
    },
    onRowSelectionChange: rowSelectionChangeHandler,
  });

  const tableClasses = useMemo(() => {
    const classList = ['fn-table', 'w-full'];
    return classList.join(' ');
  }, []);

  return (
    <table className={tableClasses}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{
                    width: header.getSize() + 'px',
                    textAlign: (header.column.columnDef.meta as any)?.align || 'left',
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                style={{
                  textAlign: (cell.column.columnDef.meta as any)?.align || 'left',
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      {showFooter && (
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.footer, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      )}
    </table>
  );
}

export default FnTable;
