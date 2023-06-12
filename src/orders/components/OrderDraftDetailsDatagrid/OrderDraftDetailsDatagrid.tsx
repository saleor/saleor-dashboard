import ColumnPicker from "@dashboard/components/ColumnPicker";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import { useColumnsDefault } from "@dashboard/components/Datagrid/hooks/useColumnsDefault";
import {
  DatagridChangeOpts,
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { OrderDetailsFragment, OrderErrorFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { productUrl } from "@dashboard/products/urls";
import React, { useCallback } from "react";
import { useIntl } from "react-intl";

import { FormData } from "../OrderDraftDetailsProducts/OrderDraftDetailsProducts";
import { useColumns, useGetCellContent } from "./datagrid";
import { messages } from "./messages";

interface OrderDraftDetailsDatagridProps {
  loading: boolean;
  lines: OrderDetailsFragment["lines"];
  errors: OrderErrorFragment[];
  onOrderLineChange: (id: string, data: FormData) => void;
  onOrderLineRemove: (id: string) => void;
}

export const OrderDraftDetailsDatagrid = ({
  lines,
  errors,
  onOrderLineChange,
  onOrderLineRemove,
}: OrderDraftDetailsDatagridProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const datagrid = useDatagridChangeState();

  const { availableColumns } = useColumns();

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

  const getCellContent = useGetCellContent({
    columns,
    lines,
    errors,
  });

  const getMenuItems = useCallback(
    index => [
      {
        label: intl.formatMessage(messages.deleteOrder),
        onSelect: () => {
          onOrderLineRemove(lines[index].id);
        },
      },
      {
        label: intl.formatMessage(messages.productDetails),
        onSelect: () => {
          window.open(productUrl(lines[index].variant.product.id), "_blank");
        },
      },
    ],
    [intl, lines, navigate, onOrderLineRemove],
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
            IconButtonProps={{
              ...defaultProps.IconButtonProps,
              disabled: lines.length === 0,
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
        onChange={handleDatagridChange}
      />
    </DatagridChangeStateContext.Provider>
  );
};
