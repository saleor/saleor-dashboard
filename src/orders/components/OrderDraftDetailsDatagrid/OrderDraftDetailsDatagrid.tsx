// @ts-strict-ignore
import ColumnPicker from "@dashboard/components/ColumnPicker";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import { useColumnsDefault } from "@dashboard/components/Datagrid/hooks/useColumnsDefault";
import {
  DatagridChangeOpts,
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { OrderDetailsFragment, OrderErrorFragment } from "@dashboard/graphql";
import { productUrl } from "@dashboard/products/urls";
import {
  Box,
  ExternalLinkIcon,
  sprinkles,
  TrashBinIcon,
} from "@saleor/macaw-ui/next";
import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

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
        label: "",
        Icon: (
          <Link
            to={productUrl(lines[index]?.variant.product.id)}
            data-test-id="open-product-details"
            target="_blank"
            className={sprinkles({
              display: "flex",
              alignItems: "center",
              gap: 2,
            })}
          >
            <ExternalLinkIcon />
            {intl.formatMessage(messages.productDetails)}
          </Link>
        ),
        onSelect: () => false,
      },
      {
        label: "",
        Icon: (
          <Box
            data-test-id="delete-order-line"
            as="span"
            color="iconCriticalDefault"
            display="flex"
            alignItems="center"
            __marginLeft="-2px"
            gap={2}
          >
            <TrashBinIcon />
            {intl.formatMessage(messages.deleteOrder)}
          </Box>
        ),
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

          if (column === "quantity" && data.value !== "") {
            return onOrderLineChange(orderId, { quantity: data.value });
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
