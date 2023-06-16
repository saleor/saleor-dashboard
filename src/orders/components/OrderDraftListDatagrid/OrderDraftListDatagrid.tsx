import ColumnPicker from "@dashboard/components/ColumnPicker/ColumnPicker";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import { useColumnsDefault } from "@dashboard/components/Datagrid/hooks/useColumnsDefault";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { OrderDraftListQuery } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { OrderDraftListUrlSortField } from "@dashboard/orders/urls";
import { ListProps, RelayToFlat, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
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
  rowAnchor?: (id: string) => string;
}

export const OrderDraftListDatagrid = ({
  disabled,
  orders,
  sort,
  onSort,
  hasRowHover,
  onRowClick,
  rowAnchor,
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
      if (!rowAnchor) {
        return;
      }
      const rowData = orders[row];
      return rowAnchor(rowData.id);
    },
    [rowAnchor, orders],
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
    </DatagridChangeStateContext.Provider>
  );
};
