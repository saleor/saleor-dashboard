import ColumnPicker from "@dashboard/components/ColumnPicker";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeOpts,
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { defaultListSettings, OrderDraftListColumns } from "@dashboard/config";
import {
  GridAttributesQuery,
  OrderDetailsFragment,
  OrderErrorFragment,
  SearchAvailableInGridAttributesQuery,
} from "@dashboard/graphql";
import { isAttributeColumnValue } from "@dashboard/products/components/ProductListPage/utils";
import { ListProps, ListViews, RelayToFlat } from "@dashboard/types";
import { addAtIndex, removeAtIndex } from "@dashboard/utils/lists";
import { GridColumn } from "@glideapps/glide-data-grid";
import { TrashBinIcon } from "@saleor/macaw-ui/next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { FormData } from "../OrderDraftDetailsProducts/OrderDraftDetailsProducts";
import {
  useColumnPickerColumns,
  useDatagridColumns,
  useGetCellContent,
} from "./datagrid";
import { messages } from "./messages";

interface OrderDraftDetailsDatagridProps
  extends Pick<
    ListProps<OrderDraftListColumns>,
    "settings" | "onUpdateListSettings"
  > {
  loading: boolean;
  lines: OrderDetailsFragment["lines"];
  errors: OrderErrorFragment[];
  onOrderLineChange: (id: string, data: FormData) => void;
  onOrderLineRemove: (id: string) => void;
  gridAttributes: RelayToFlat<GridAttributesQuery["grid"]>;
  availableInGridAttributes: {
    data: RelayToFlat<SearchAvailableInGridAttributesQuery["availableInGrid"]>;
    loading: boolean;
    hasMore: boolean;
    query: string;
    search: (query: string) => void;
    loadMore: () => void;
  };
}

export const OrderDraftDetailsDatagrid = ({
  lines,
  errors,
  onOrderLineChange,
  onOrderLineRemove,
  availableInGridAttributes,
  gridAttributes,
  settings,
  onUpdateListSettings,
}: OrderDraftDetailsDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();

  const gridAttributesFromSettings = useMemo(
    () => settings.columns.filter(isAttributeColumnValue),
    [settings.columns],
  );

  const { columns, setColumns } = useDatagridColumns({
    gridAttributes,
    gridAttributesFromSettings,
    settings,
  });

  const handleColumnMoved = useCallback(
    (startIndex: number, endIndex: number): void => {
      setColumns(old =>
        addAtIndex(old[startIndex], removeAtIndex(old, startIndex), endIndex),
      );
    },
    [setColumns],
  );

  const handleColumnResize = useCallback(
    (column: GridColumn, newSize: number) => {
      if (column.id === "empty") {
        return;
      }

      setColumns(prevColumns =>
        prevColumns.map(prevColumn =>
          prevColumn.id === column.id
            ? { ...prevColumn, width: newSize }
            : prevColumn,
        ),
      );
    },
    [setColumns],
  );

  const columnPickerColumns = useColumnPickerColumns(
    gridAttributes,
    availableInGridAttributes.data,
    settings,
    defaultListSettings[ListViews.ORDER_DRAFT_DETAILS].columns as any,
  );

  const getCellContent = useGetCellContent({
    columns,
    lines,
    errors,
  });

  const getMenuItems = useCallback(
    index => [
      {
        label: intl.formatMessage(messages.deleteOrder),
        Icon: <TrashBinIcon />,
        onSelect: () => {
          onOrderLineRemove(lines[index].id);
        },
      },
    ],
    [intl, lines, onOrderLineRemove],
  );

  const handleDatagridChange = useCallback(
    async (
      { updates }: DatagridChangeOpts,
      setMarkCellsDirty: (areCellsDirty: boolean) => void,
    ) => {
      await Promise.all(
        updates.map(({ data, column, row }) => {
          const orderId = lines[row].id;

          if (column === "quantity" && data !== "") {
            return onOrderLineChange(orderId, { quantity: data });
          }
        }),
      );

      datagrid.changes.current = [];
      setMarkCellsDirty(false);
    },
    [datagrid.changes, lines, onOrderLineChange],
  );

  const handleColumnChange = useCallback(
    (picked: OrderDraftListColumns[]) => {
      onUpdateListSettings("columns", picked);
    },
    [onUpdateListSettings],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        rowMarkers="none"
        columnSelect="none"
        freezeColumns={2}
        verticalBorder={col => (col > 1 ? true : false)}
        availableColumns={columns}
        emptyText={intl.formatMessage(messages.emptyText)}
        getCellContent={getCellContent}
        getCellError={() => false}
        menuItems={getMenuItems}
        rows={lines.length}
        selectionActions={() => null}
        onColumnResize={handleColumnResize}
        onColumnMoved={handleColumnMoved}
        renderColumnPicker={defaultProps => (
          <ColumnPicker
            {...defaultProps}
            {...columnPickerColumns}
            IconButtonProps={{
              ...defaultProps.IconButtonProps,
              disabled: lines.length === 0,
            }}
            onSave={handleColumnChange}
            hasMore={availableInGridAttributes.hasMore}
            loading={availableInGridAttributes.loading}
            onFetchMore={availableInGridAttributes.loadMore}
            onQueryChange={availableInGridAttributes.search}
            query={availableInGridAttributes.query}
          />
        )}
        onChange={handleDatagridChange}
      />
    </DatagridChangeStateContext.Provider>
  );
};
