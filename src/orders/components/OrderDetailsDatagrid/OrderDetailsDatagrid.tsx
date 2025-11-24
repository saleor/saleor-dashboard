// @ts-strict-ignore
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import { ROW_ACTION_BAR_WIDTH } from "@dashboard/components/Datagrid/const";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { useEmptyColumn } from "@dashboard/components/Datagrid/hooks/useEmptyColumn";
import { OrderLineFragment } from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import { productPath } from "@dashboard/products/urls";
import { ListViews } from "@dashboard/types";
import { Theme } from "@glideapps/glide-data-grid";
import { ExternalLinkIcon } from "@saleor/macaw-ui-next";
import { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { messages as orderMessages } from "../OrderListDatagrid/messages";
import { createGetCellContent, orderDetailsStaticColumnsAdapter } from "./datagrid";
import { messages } from "./messages";
import { OrderDetailsRowActions } from "./OrderDetailsRowActions";

interface OrderDetailsDatagridProps {
  lines: OrderLineFragment[];
  loading: boolean;
  onOrderLineShowMetadata: (id: string) => void;
  datagridCustomTheme?: Partial<Theme>;
}

export const OrderDetailsDatagrid = ({
  lines,
  loading,
  onOrderLineShowMetadata,
  datagridCustomTheme = {},
}: OrderDetailsDatagridProps) => {
  const intl = useIntl();

  const datagrid = useDatagridChangeState();
  const { updateListSettings, settings } = useListSettings(ListViews.ORDER_DETAILS_LIST);
  const emptyColumn = useEmptyColumn();
  const orderDetailsStaticColumns = useMemo(
    () => orderDetailsStaticColumnsAdapter(intl, emptyColumn),
    [intl, emptyColumn],
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
      gridName: "order_details_products",
      staticColumns: orderDetailsStaticColumns,
      selectedColumns: settings?.columns ?? [],
      onSave: handleColumnChange,
    });
  const getCellContent = useCallback(
    createGetCellContent({
      columns: visibleColumns,
      data: lines,
      loading,
      onOrderLineShowMetadata,
      intl,
    }),
    [visibleColumns, loading, lines, intl, onOrderLineShowMetadata],
  );
  const getMenuItems = useCallback(
    index => [
      {
        disabled: !lines[index]?.variant?.product.id,
        label: intl.formatMessage(messages.productDetails),
        Icon: lines[index]?.variant?.product.id ? (
          <Link to={productPath(lines[index].variant.product.id)} target="_blank">
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

  const renderRowActions = useCallback(
    index => (
      <OrderDetailsRowActions
        key={`row-actions-${index}`}
        menuItems={getMenuItems(index)}
        onShowMetadata={() => {
          if (lines[index]) {
            onOrderLineShowMetadata(lines[index].id);
          }
        }}
        disabled={loading}
        intl={intl}
      />
    ),
    [getMenuItems, lines, onOrderLineShowMetadata, loading, intl],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        showEmptyDatagrid
        themeOverride={datagridCustomTheme}
        rowMarkers="none"
        columnSelect="single"
        freezeColumns={2}
        availableColumns={visibleColumns}
        verticalBorder={false}
        showTopBorder={false}
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
            align="end"
          />
        )}
        renderRowActions={renderRowActions}
        rowActionBarWidth={ROW_ACTION_BAR_WIDTH}
      />
    </DatagridChangeStateContext.Provider>
  );
};
