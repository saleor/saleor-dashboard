// @ts-strict-ignore
import ColumnPicker from "@dashboard/components/ColumnPicker";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import { useColumnsDefault } from "@dashboard/components/Datagrid/hooks/useColumnsDefault";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { OrderListQuery } from "@dashboard/graphql";
import { OrderListUrlSortField } from "@dashboard/orders/urls";
import { ListProps, RelayToFlat, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui/next";
import React, { useCallback } from "react";
import { useIntl } from "react-intl";

import { useColumns, useGetCellContent } from "./datagrid";
import { messages } from "./messages";
import { canBeSorted, getColumnNameAndId, getOrdersRowsLength } from "./utils";

interface OrderListDatagridProps
  extends ListProps,
    SortPage<OrderListUrlSortField> {
  orders: RelayToFlat<OrderListQuery["orders"]>;
  onRowClick?: (id: string) => void;
  rowAnchor?: (id: string) => string;
  hasRowHover?: boolean;
}

export const OrderListDatagrid: React.FC<OrderListDatagridProps> = ({
  orders,
  disabled,
  settings,
  onUpdateListSettings,
  onSort,
  sort,
  onRowClick,
  hasRowHover,
  rowAnchor,
}) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();
  const availableColumns = useColumns(sort);
  const ordersLength = getOrdersRowsLength(orders, disabled);

  const {
    availableColumnsChoices,
    columnChoices,
    columns,
    defaultColumns,
    onColumnMoved,
    onColumnResize,
    onColumnsChange,
    picker,
  } = useColumnsDefault(availableColumns);

  const handleHeaderClick = useCallback(
    (col: number) => {
      const { columnName, columnId } = getColumnNameAndId(columns[col].id);

      if (canBeSorted(columnName)) {
        onSort(columnName, columnId);
      }
    },
    [columns, onSort],
  );

  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      if (!onRowClick) {
        return;
      }

      const rowData = orders[row];
      onRowClick(rowData.id);
    },
    [onRowClick, orders],
  );

  const handleRowAnchor = useCallback(
    ([, row]: Item) => {
      if (!rowAnchor) {
        return;
      }
      const rowData = orders[row];
      return rowAnchor(rowData.id);
    },
    [rowAnchor, orders],
  );

  const getCellContent = useGetCellContent({
    columns,
    orders,
  });

  return (
    <Box __marginTop={ordersLength > 0 ? -1 : 0}>
      <DatagridChangeStateContext.Provider value={datagrid}>
        <Datagrid
          readonly
          rowMarkers="none"
          loading={disabled}
          columnSelect="single"
          hasRowHover={hasRowHover}
          freezeColumns={2}
          verticalBorder={col => (col > 1 ? true : false)}
          availableColumns={columns}
          onHeaderClicked={handleHeaderClick}
          emptyText={intl.formatMessage(messages.emptyText)}
          getCellContent={getCellContent}
          getCellError={() => false}
          menuItems={() => []}
          rows={getOrdersRowsLength(orders, disabled)}
          selectionActions={() => null}
          onColumnResize={onColumnResize}
          onColumnMoved={onColumnMoved}
          renderColumnPicker={defaultProps => (
            <ColumnPicker
              {...defaultProps}
              availableColumns={availableColumnsChoices}
              initialColumns={columnChoices}
              defaultColumns={defaultColumns}
              onSave={onColumnsChange}
              hasMore={false}
              loading={false}
              onFetchMore={() => undefined}
              onQueryChange={picker.setQuery}
              query={picker.query}
            />
          )}
          fullScreenTitle={intl.formatMessage(messages.orders)}
          onRowClick={handleRowClick}
          rowAnchor={handleRowAnchor}
        />

        <Box paddingX={6}>
          <TablePaginationWithContext
            component="div"
            settings={settings}
            disabled={disabled}
            onUpdateListSettings={onUpdateListSettings}
          />
        </Box>
      </DatagridChangeStateContext.Provider>
    </Box>
  );
};
