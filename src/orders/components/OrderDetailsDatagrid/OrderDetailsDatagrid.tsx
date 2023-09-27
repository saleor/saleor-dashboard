// @ts-strict-ignore
import ColumnPicker from "@dashboard/components/ColumnPicker";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { OrderLineFragment } from "@dashboard/graphql";
import { productPath } from "@dashboard/products/urls";
import { ExternalLinkIcon } from "@saleor/macaw-ui/next";
import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { messages as orderMessages } from "../OrderListDatagrid/messages";
import { useColumns, useGetCellContent } from "./datagrid";
import { messages } from "./messages";

interface OrderDetailsDatagridProps {
  lines: OrderLineFragment[];
  loading: boolean;
}

export const OrderDetailsDatagrid = ({
  lines,
  loading,
}: OrderDetailsDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();

  const { updateListSettings, settings } = useListSettings(
    ListViews.ORDER_DETAILS_LIST,
  );

  const orderDetailsStaticColumns = useMemo(
    () => orderDetailsStaticColumnsAdapter(intl),
    [intl],
  );

  const handleColumnChange = useCallback(
    picked => {
      if (updateListSettings) {
        updateListSettings("columns", picked.filter(Boolean));
      }
    },
    [updateListSettings],
  );

  const {
    handlers,
    visibleColumns,
    staticColumns,
    selectedColumns,
    recentlyAddedColumn,
  } = useColumns({
    staticColumns: orderDetailsStaticColumns,
    selectedColumns: settings?.columns ?? [],
    onSave: handleColumnChange,
  });

  const getMenuItems = useCallback(
    index => [
      {
        disabled: !lines[index]?.variant?.product.id,
        label: intl.formatMessage(messages.productDetails),
        Icon: lines[index]?.variant?.product.id ? (
          <Link
            to={productPath(lines[index].variant.product.id)}
            target="_blank"
          >
            <ExternalLinkIcon />
          </Link>
        ) : (
          <ExternalLinkIcon />
        ),
        onSelect: () => false,
      },
    ],
    [intl, lines],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        showEmptyDatagrid
        rowMarkers="none"
        columnSelect="single"
        freezeColumns={1}
        availableColumns={columns}
        emptyText={intl.formatMessage(orderMessages.emptyText)}
        getCellContent={getCellContent}
        getCellError={() => false}
        menuItems={getMenuItems}
        rows={loading ? 1 : lines.length}
        selectionActions={() => null}
        onColumnResize={handlers.onResize}
        onColumnMoved={handlers.onMove}
        recentlyAddedColumn={recentlyAddedColumn}
        renderColumnPicker={() => (
          <ColumnPicker
            staticColumns={staticColumns}
            selectedColumns={selectedColumns}
            onToggle={handlers.onToggle}
          />
        )}
      />
    </DatagridChangeStateContext.Provider>
  );
};
