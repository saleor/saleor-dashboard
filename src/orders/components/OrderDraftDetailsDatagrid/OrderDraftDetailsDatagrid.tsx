import ColumnPicker from "@dashboard/components/ColumnPicker";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import { useColumnsDefault } from "@dashboard/components/Datagrid/hooks/useColumnsDefault";
import {
  DatagridChangeOpts,
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { defaultListSettings, OrderDraftListColumns } from "@dashboard/config";
import {
  OrderDetailsFragment,
  OrderErrorFragment,
  SearchAvailableInGridAttributesQuery,
} from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import { ListViews, RelayToFlat } from "@dashboard/types";
import { TrashBinIcon } from "@saleor/macaw-ui/next";
import React, { useCallback } from "react";
import { useIntl } from "react-intl";

import { FormData } from "../OrderDraftDetailsProducts/OrderDraftDetailsProducts";
import {
  useColumnPickerColumns,
  useColumns,
  useGetCellContent,
} from "./datagrid";
import { messages } from "./messages";

interface OrderDraftDetailsDatagridProps {
  loading: boolean;
  lines: OrderDetailsFragment["lines"];
  errors: OrderErrorFragment[];
  onOrderLineChange: (id: string, data: FormData) => void;
  onOrderLineRemove: (id: string) => void;
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
}: OrderDraftDetailsDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();

  const { availableColumns } = useColumns();

  const { updateListSettings, settings } =
    useListSettings<OrderDraftListColumns>(ListViews.ORDER_DRAFT_DETAILS);

  const { columns, onColumnMoved, onColumnResize } =
    useColumnsDefault(availableColumns);

  const columnPickerColumns = useColumnPickerColumns(
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
      updateListSettings("columns", picked);
    },
    [updateListSettings],
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
        onColumnResize={onColumnResize}
        onColumnMoved={onColumnMoved}
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
