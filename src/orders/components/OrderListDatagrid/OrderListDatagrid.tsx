// @ts-strict-ignore
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { useEmptyColumn } from "@dashboard/components/Datagrid/hooks/useEmptyColumn";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { OrderListQuery } from "@dashboard/graphql";
import { OrderListUrlSortField } from "@dashboard/orders/urls";
import { ListProps, RelayToFlat, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui/next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { orderListStaticColumnAdapter, useGetCellContent } from "./datagrid";
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
  const ordersLength = getOrdersRowsLength(orders, disabled);

  const handleColumnChange = useCallback(
    picked => {
      onUpdateListSettings("columns", picked.filter(Boolean));
    },
    [onUpdateListSettings],
  );

  const emptyColumn = useEmptyColumn();
  const memoizedStaticColumns = useMemo(
    () => orderListStaticColumnAdapter(emptyColumn, intl, sort),
    [emptyColumn, intl, sort],
  );

  const { handlers, staticColumns, visibleColumns, selectedColumns } =
    useColumns({
      staticColumns: memoizedStaticColumns,
      selectedColumns: settings?.columns ?? [],
      onSave: handleColumnChange,
    });

  const handleHeaderClick = useCallback(
    (col: number) => {
      const { columnName, columnId } = getColumnNameAndId(
        visibleColumns[col].id,
      );

      if (canBeSorted(columnName)) {
        onSort(columnName, columnId);
      }
    },
    [visibleColumns, onSort],
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
    columns: visibleColumns,
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
          verticalBorder={col => col > 1}
          availableColumns={visibleColumns}
          onHeaderClicked={handleHeaderClick}
          emptyText={intl.formatMessage(messages.emptyText)}
          getCellContent={getCellContent}
          getCellError={() => false}
          menuItems={() => []}
          rows={getOrdersRowsLength(orders, disabled)}
          selectionActions={() => null}
          onColumnResize={handlers.onResize}
          onColumnMoved={handlers.onMove}
          renderColumnPicker={() => (
            <ColumnPicker
              staticColumns={staticColumns}
              selectedColumns={selectedColumns}
              onToggle={handlers.onToggle}
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
