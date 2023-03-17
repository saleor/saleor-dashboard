import ColumnPicker from "@dashboard/components/ColumnPicker";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import { useColumnsDefault } from "@dashboard/components/Datagrid/hooks/useColumnsDefault";
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

import { getColumns, useGetCellContent } from "./datagrid";
import { messages } from "./messages";
import { canBeSorted, getColumnMetadata, getOrdersRowsLength } from "./utils";

interface OrderListDatagridProps
  extends ListProps,
    SortPage<OrderListUrlSortField> {
  orders: RelayToFlat<OrderListQuery["orders"]>;
  onRowClick: (id: string) => void;
}

export const OrderListDatagrid: React.FC<OrderListDatagridProps> = ({
  orders,
  disabled,
  settings,
  onUpdateListSettings,
  onSort,
  sort,
  onRowClick,
}) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();
  const emptyColumn = useEmptyColumn();

  const availableColumns = useMemo(
    () => getColumns(intl, sort, emptyColumn),
    [intl, sort, emptyColumn],
  );

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
      const { columnName, columnId } = getColumnMetadata(columns[col].id);

      if (canBeSorted(columnName)) {
        onSort(columnName, columnId);
      }
    },
    [columns, onSort],
  );

  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      const rowData = orders[row];
      onRowClick(rowData.id);
    },
    [onRowClick, orders],
  );

  const getCellContent = useGetCellContent({
    columns,
    orders,
    loading: disabled,
  });

  return (
    <Box __marginTop={-1}>
      <DatagridChangeStateContext.Provider value={datagrid}>
        <Datagrid
          readonly
          rowMarkers="none"
          columnSelect="single"
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
        />

        <Box paddingX={9}>
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
