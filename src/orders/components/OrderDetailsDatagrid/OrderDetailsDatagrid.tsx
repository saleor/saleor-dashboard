import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import { ROW_ACTION_BAR_WIDTH } from "@dashboard/components/Datagrid/const";
import { Datagrid } from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { useEmptyColumn } from "@dashboard/components/Datagrid/hooks/useEmptyColumn";
import { type OrderDetailsFragment, type OrderLineFragment } from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocale from "@dashboard/hooks/useLocale";
import useNavigator from "@dashboard/hooks/useNavigator";
import { OrderLineRowActions } from "@dashboard/orders/components/OrderLineRowActions/OrderLineRowActions";
import { messages as orderMessages } from "@dashboard/orders/components/OrderListDatagrid/messages";
import { rippleOrderLinePriceBreakdown } from "@dashboard/orders/ripples/orderLinePriceBreakdown";
import { type OrderLineRowMenuContext } from "@dashboard/orders/utils/getOrderLineActionUrls";
import { getOrderLineRowMenuItems } from "@dashboard/orders/utils/getOrderLineRowMenuItems";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { ListViews } from "@dashboard/types";
import { type Item, type Theme } from "@glideapps/glide-data-grid";
import { Box, type vars } from "@saleor/macaw-ui-next";
import { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import {
  createGetCellContent,
  isLineDiscounted,
  isPriceBreakdownColumn,
  type LineReasonDisplay,
  orderDetailsStaticColumnsAdapter,
} from "./datagrid";

interface OrderDetailsDatagridProps {
  lines: OrderLineFragment[];
  order: OrderDetailsFragment;
  loading: boolean;
  onOrderLineShowMetadata: (id: string) => void;
  /** Optional callback to open the per-line price-waterfall modal. When set,
   *  the `price` and `total` cells of discounted lines become clickable;
   *  the strikethrough on the original price is the only visual affordance. */
  onShowLinePriceBreakdown?: (lineId: string) => void;
  datagridCustomTheme?: Partial<Theme>;
  /** Matches the datagrid header surface so the sticky column picker masks scrolled cells. */
  columnPickerBackgroundColor?: keyof typeof vars.colors.background;
  /** Per-line reasons aligned by index with `lines`; when set, a `reason` column is shown. */
  lineReasons?: LineReasonDisplay[];
  /** Timeline cards scope row actions to the shipment bucket; matrix omits this. */
  lineRowMenuContext?: OrderLineRowMenuContext;
}

export const OrderDetailsDatagrid = ({
  lines,
  order,
  loading,
  onOrderLineShowMetadata,
  onShowLinePriceBreakdown,
  datagridCustomTheme = {},
  columnPickerBackgroundColor = "default1",
  lineReasons,
  lineRowMenuContext,
}: OrderDetailsDatagridProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { locale } = useLocale();

  const datagrid = useDatagridChangeState();
  const { updateListSettings, settings } = useListSettings(ListViews.ORDER_DETAILS_LIST);
  const emptyColumn = useEmptyColumn();
  const orderDetailsStaticColumns = useMemo(
    () =>
      orderDetailsStaticColumnsAdapter(intl, emptyColumn, {
        withReasonColumn: Boolean(lineReasons),
      }),
    [intl, emptyColumn, lineReasons],
  );
  const handleColumnChange = useCallback(
    (picked: string[]) => {
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
      locale,
      interactivePricing: Boolean(onShowLinePriceBreakdown),
      lineReasons,
    }),
    [
      visibleColumns,
      loading,
      lines,
      intl,
      onOrderLineShowMetadata,
      locale,
      onShowLinePriceBreakdown,
      lineReasons,
    ],
  );
  const getLineMenuItems = useCallback(
    (index: number) => {
      const line = lines[index];

      if (!line) {
        return [];
      }

      return getOrderLineRowMenuItems({
        order,
        lineId: line.id,
        productId: line.variant?.product.id,
        intl,
        navigate,
        context: lineRowMenuContext,
      });
    },
    [intl, lines, navigate, order, lineRowMenuContext],
  );
  const getMenuItems = useCallback(
    (index: number) =>
      getLineMenuItems(index).map(item => ({
        label: item.label,
        onSelect: () => {
          item.onSelect({});
        },
      })),
    [getLineMenuItems],
  );

  const renderRowActions = useCallback(
    (index: number) => (
      <OrderLineRowActions
        key={`row-actions-${index}`}
        menuItems={getLineMenuItems(index)}
        onShowMetadata={() => {
          if (lines[index]) {
            onOrderLineShowMetadata(lines[index].id);
          }
        }}
        disabled={loading}
        intl={intl}
      />
    ),
    [getLineMenuItems, lines, onOrderLineShowMetadata, loading, intl],
  );

  const handleRowClick = useCallback(
    ([col, row]: Item) => {
      if (!isPriceBreakdownColumn(visibleColumns[col]?.id)) return;

      const line = lines[row];

      if (!line || !isLineDiscounted(line)) return;

      onShowLinePriceBreakdown?.(line.id);
    },
    [onShowLinePriceBreakdown, visibleColumns, lines],
  );

  // Ripple cannot be anchored to a Glide canvas cell directly; place it at the
  // top-right of the datagrid wrapper, roughly above the price/total columns.
  // The strikethrough on a discounted price is the only persistent affordance;
  // the ripple is a one-time discovery hint for the click-to-explain behavior.
  const showPricingRipple = Boolean(onShowLinePriceBreakdown) && lines.some(isLineDiscounted);

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Box position="relative">
        {showPricingRipple && (
          <Box position="absolute" __top="-4px" __right="64px" __zIndex="1">
            <Ripple model={rippleOrderLinePriceBreakdown} />
          </Box>
        )}
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
              backgroundColor={columnPickerBackgroundColor}
            />
          )}
          renderRowActions={renderRowActions}
          rowActionBarWidth={ROW_ACTION_BAR_WIDTH}
          onRowClick={onShowLinePriceBreakdown ? handleRowClick : undefined}
          onCellActivated={onShowLinePriceBreakdown ? handleRowClick : undefined}
        />
      </Box>
    </DatagridChangeStateContext.Provider>
  );
};
