import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import useLocale from "@dashboard/hooks/useLocale";
import { OrderDraft } from "@dashboard/orders/types";
import { OrderDraftListUrlSortField, orderUrl } from "@dashboard/orders/urls";
import { ListProps, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { createGetCellContent, orderDraftListStaticColumnsAdapter } from "./datagrid";
import { messages } from "./messages";
import { canBeSorted } from "./utils";

interface OrderDraftListDatagridProps extends ListProps, SortPage<OrderDraftListUrlSortField> {
  orders: OrderDraft[];
  hasRowHover?: boolean;
  onRowClick?: (id: string) => void;
  onSelectOrderDraftIds: (ids: number[], clearSelection: () => void) => void;
}

export const OrderDraftListDatagrid = ({
  disabled,
  orders,
  sort,
  onSort,
  hasRowHover,
  onRowClick,
  settings,
  onUpdateListSettings,
  onSelectOrderDraftIds,
}: OrderDraftListDatagridProps) => {
  const location = useLocation();
  const intl = useIntl();
  const { locale } = useLocale();
  const datagridState = useDatagridChangeState();
  const handleColumnChange = useCallback(
    picked => {
      if (onUpdateListSettings) {
        onUpdateListSettings("columns", picked.filter(Boolean));
      }
    },
    [onUpdateListSettings],
  );
  const memoizedStaticColumns = useMemo(
    () => orderDraftListStaticColumnsAdapter(intl, sort),
    [intl, sort],
  );
  const { handlers, staticColumns, visibleColumns, selectedColumns } = useColumns({
    gridName: "order_drafts_list",
    staticColumns: memoizedStaticColumns,
    selectedColumns: settings?.columns ?? [],
    onSave: handleColumnChange,
  });
  const getCellContent = useCallback(
    createGetCellContent({ orders, columns: visibleColumns, locale }),
    [visibleColumns, locale, orders],
  );
  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnName = visibleColumns[col].id as OrderDraftListUrlSortField;

      if (canBeSorted(columnName)) {
        onSort(columnName);
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
      const rowData = orders[row];

      return orderUrl(rowData.id);
    },
    [orders],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagridState}>
      <Datagrid
        readonly
        rowMarkers="checkbox-visible"
        columnSelect="single"
        freezeColumns={1}
        hasRowHover={hasRowHover}
        loading={disabled}
        availableColumns={visibleColumns}
        verticalBorder={false}
        getCellContent={getCellContent}
        getCellError={() => false}
        menuItems={() => []}
        emptyText={intl.formatMessage(messages.emptyText)}
        rows={orders?.length ?? 0}
        selectionActions={() => null}
        onRowSelectionChange={onSelectOrderDraftIds}
        onColumnResize={handlers.onResize}
        onColumnMoved={handlers.onMove}
        onHeaderClicked={handleHeaderClick}
        onRowClick={handleRowClick}
        rowAnchor={handleRowAnchor}
        renderColumnPicker={() => (
          <ColumnPicker
            staticColumns={staticColumns}
            selectedColumns={selectedColumns}
            onToggle={handlers.onToggle}
          />
        )}
        navigatorOpts={{
          state: {
            prevLocation: location,
          },
        }}
      />

      <Box paddingX={6}>
        <TablePaginationWithContext
          component="div"
          colSpan={1}
          settings={settings}
          disabled={disabled}
          onUpdateListSettings={onUpdateListSettings}
        />
      </Box>
    </DatagridChangeStateContext.Provider>
  );
};
