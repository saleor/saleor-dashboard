// @ts-strict-ignore
import ColumnPicker from "@dashboard/components/ColumnPicker/ColumnPicker";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import { useColumnsDefault } from "@dashboard/components/Datagrid/hooks/useColumnsDefault";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { OrderDraftListQuery } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { OrderDraftListUrlSortField, orderUrl } from "@dashboard/orders/urls";
import { ListProps, RelayToFlat, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui/next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { createGetCellContent, getColumns } from "./datagrid";
import { messages } from "./messages";
import { canBeSorted } from "./utils";

interface OrderDraftListDatagridProps
  extends ListProps,
    SortPage<OrderDraftListUrlSortField> {
  orders: RelayToFlat<OrderDraftListQuery["draftOrders"]>;
  hasRowHover?: boolean;
  onRowClick?: (id: string) => void;
  onSelectOrderDraftIds;
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
  const intl = useIntl();
  const { locale } = useLocale();
  const datagridState = useDatagridChangeState();

  const availableColumns = useMemo(() => getColumns(intl, sort), [intl, sort]);

  const {
    columns,
    availableColumnsChoices,
    columnChoices,
    defaultColumns,
    onColumnMoved,
    onColumnResize,
    onColumnsChange,
    picker,
  } = useColumnsDefault(availableColumns);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCellContent = useCallback(
    createGetCellContent({ orders, columns, locale }),
    [columns, locale, orders],
  );

  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnName = columns[col].id as OrderDraftListUrlSortField;
      if (canBeSorted(columnName)) {
        onSort(columnName);
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
      const rowData = orders[row];
      return orderUrl(rowData.id);
    },
    [orders],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagridState}>
      <Datagrid
        readonly
        rowMarkers="checkbox"
        columnSelect="single"
        freezeColumns={1}
        hasRowHover={hasRowHover}
        loading={disabled}
        availableColumns={columns}
        verticalBorder={col => col > 0}
        getCellContent={getCellContent}
        getCellError={() => false}
        menuItems={() => []}
        emptyText={intl.formatMessage(messages.emptyText)}
        rows={orders?.length ?? 0}
        selectionActions={() => null}
        onRowSelectionChange={onSelectOrderDraftIds}
        onColumnMoved={onColumnMoved}
        onColumnResize={onColumnResize}
        onHeaderClicked={handleHeaderClick}
        onRowClick={handleRowClick}
        rowAnchor={handleRowAnchor}
        renderColumnPicker={defaultProps => (
          <ColumnPicker
            {...defaultProps}
            IconButtonProps={{
              ...defaultProps.IconButtonProps,
              disabled: orders.length === 0,
            }}
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
