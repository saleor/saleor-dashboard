// @ts-strict-ignore
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeOpts,
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { useEmptyColumn } from "@dashboard/components/Datagrid/hooks/useEmptyColumn";
import { OrderDetailsFragment, OrderErrorFragment } from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import { productUrl } from "@dashboard/products/urls";
import { ListViews } from "@dashboard/types";
import { Box, ExternalLinkIcon, sprinkles, TrashBinIcon } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { FormData } from "../OrderDraftDetailsProducts/OrderDraftDetailsProducts";
import { orderDraftDetailsStaticColumnsAdapter, useGetCellContent } from "./datagrid";
import { messages } from "./messages";

interface OrderDraftDetailsDatagridProps {
  loading: boolean;
  lines: OrderDetailsFragment["lines"];
  errors: OrderErrorFragment[];
  onOrderLineChange: (id: string, data: FormData) => void;
  onOrderLineRemove: (id: string) => void;
  onShowMetadata: (id: string) => void;
}

export const OrderDraftDetailsDatagrid = ({
  lines,
  errors,
  onOrderLineChange,
  onOrderLineRemove,
  onShowMetadata,
}: OrderDraftDetailsDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();
  const { updateListSettings, settings } = useListSettings(ListViews.ORDER_DRAFT_DETAILS_LIST);
  const emptyColumn = useEmptyColumn();
  const orderDraftDetailsStaticColumns = useMemo(
    () => orderDraftDetailsStaticColumnsAdapter(emptyColumn, intl),
    [emptyColumn, intl],
  );
  const handleColumnChange = useCallback(
    picked => {
      if (updateListSettings) {
        updateListSettings("columns", picked.filter(Boolean));
      }
    },
    [updateListSettings],
  );
  const { handlers, visibleColumns, staticColumns, selectedColumns, recentlyAddedColumn } =
    useColumns({
      gridName: "order_draft_details_products",
      staticColumns: orderDraftDetailsStaticColumns,
      selectedColumns: settings?.columns ?? [],
      onSave: handleColumnChange,
    });
  const getCellContent = useGetCellContent({
    columns: visibleColumns,
    lines,
    errors,
    onShowMetadata,
  });
  const getMenuItems = useCallback(
    index => [
      {
        label: "",
        disabled: !lines[index]?.variant?.product.id,
        Icon: lines[index]?.variant?.product.id ? (
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
        ) : (
          <Box display="flex" alignItems="center" gap={2}>
            <ExternalLinkIcon />
            {intl.formatMessage(messages.productDetails)}
          </Box>
        ),
        onSelect: () => false,
      },
      {
        label: "",
        Icon: (
          <Box
            data-test-id="delete-order-line"
            as="span"
            color="critical1"
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
      { currentUpdate }: DatagridChangeOpts,
      setMarkCellsDirty: (areCellsDirty: boolean) => void,
    ) => {
      if (!currentUpdate) return;

      const { data, column, row } = currentUpdate;
      const orderId = lines[row].id;

      if (column === "quantity" && data.value !== "") {
        await onOrderLineChange(orderId, { quantity: data.value });
      }

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
        verticalBorder={false}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.emptyText)}
        getCellContent={getCellContent}
        getCellError={() => false}
        menuItems={getMenuItems}
        rows={lines.length}
        selectionActions={() => null}
        onColumnResize={handlers.onResize}
        onColumnMoved={handlers.onMove}
        recentlyAddedColumn={recentlyAddedColumn}
        renderColumnPicker={() => (
          <ColumnPicker
            selectedColumns={selectedColumns}
            staticColumns={staticColumns}
            onToggle={handlers.onToggle}
          />
        )}
        onChange={handleDatagridChange}
      />
    </DatagridChangeStateContext.Provider>
  );
};
