import React from 'react';
import {
  HeaderGroup,
  Row,
  TableInstance,
  TableOptions,
  useTable,
} from "react-table"

import { useMaintainScrollBottom } from "../../hooks/useMaintainScrollBottom"

type RowId = string | number

export type TableProps<T extends {}> = TableOptions<T> & {
  error?: string
  onRowClick?: (rowId: RowId, data: Row<T>["original"]) => void
  selectedRowId?: RowId | null
  isScollBottomMaintained?: boolean
}

type TableBodyProps<T extends {}> = TableInstance<T> & {
  onRowClick?: (data: Row<T>) => void
  selectedRowId?: RowId | null
}

interface BaseRowData {
  id: RowId
}

const TableHead = <T extends {}>({
  headerGroups,
}: {
  headerGroups: Array<HeaderGroup<T>>
}) => (
  <thead>
    {headerGroups.map(({ getHeaderGroupProps, headers }) => (
      <tr {...getHeaderGroupProps()} className="text-left sticky top-0 z-10">
        {headers.map(({ getHeaderProps, render }) => (
          <th
            {...getHeaderProps()}
            className="bg-gray-100 dark:bg-gray-800 p-2 border-r border-b border-gray-300 dark:border-gray-600 last:border-r-0"
          >
            {render("Header")}
          </th>
        ))}
      </tr>
    ))}
  </thead>
)

const TableBody = <T extends BaseRowData>({
  rows,
  getTableBodyProps,
  prepareRow,
  onRowClick,
  selectedRowId,
}: TableBodyProps<T>) => (
  <tbody {...getTableBodyProps()}>
    {rows.map((row) => {
      prepareRow(row)

      const isSelected = row.original.id === selectedRowId
      return (
        <tr
          {...row.getRowProps()}
          className={`${
            isSelected
              ? "text-white bg-blue-500 dark:bg-blue-600"
              : "even:bg-gray-200 dark:even:bg-gray-900 odd:bg-gray-100 dark:odd:bg-gray-800 hover:bg-blue-300 dark:hover:bg-blue-900"
          } cursor-pointer `}
          aria-selected={isSelected}
        >
          {row.cells.map((cell) => (
            <td
              {...cell.getCellProps()}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className="p-2 border-r border-gray-300 dark:border-gray-600 last:border-r-0"
            >
              {cell.render("Cell")}
            </td>
          ))}
        </tr>
      )
    })}
  </tbody>
)

export const Table = <T extends BaseRowData>(props: TableProps<T>) => {
  const {
    columns,
    data,
    error,
    onRowClick,
    selectedRowId,
    isScollBottomMaintained,
  } = props
  const tableInstance = useTable({ columns, data })
  const { getTableProps, headerGroups } = tableInstance
  const ref = useMaintainScrollBottom({
    totalEntries: data.length,
    isActive: isScollBottomMaintained,
  })

  return (
    <div
      className="relative h-full flex flex-col scroll overflow-y-scroll"
      ref={ref}
      data-testid="table-scroll"
    >
      <table
        {...getTableProps()}
        className={`w-full whitespace-nowrap border-separate`}
        style={{ borderSpacing: 0 }}
      >
        <TableHead headerGroups={headerGroups} />
        <TableBody
          {...tableInstance}
          onRowClick={(row) => {
            if (onRowClick) {
              onRowClick(row.original.id, row.original)
            }
          }}
          selectedRowId={selectedRowId}
        />
      </table>
      {(() => {
        if (error) {
          return (
            <div className="w-full flex flex-1 items-center justify-center">
              <div className="p-6 text-center">{error}</div>
            </div>
          )
        } else if (data.length === 0) {
          return (
            <div className="w-full flex flex-1 items-center justify-center">
              <div className="p-6 text-center">
                No requests have been detected
              </div>
            </div>
          )
        }
      })()}
    </div>
  )
}
