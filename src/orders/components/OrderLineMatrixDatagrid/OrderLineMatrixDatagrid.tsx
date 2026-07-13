// @ts-strict-ignore
import { type TopNavMenuItem } from "@dashboard/components/AppLayout/TopNav/Menu";
import { type CardMenuItem } from "@dashboard/components/CardMenu";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import { ROW_ACTION_BAR_WIDTH } from "@dashboard/components/Datagrid/const";
import { Datagrid } from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { type OrderDetailsFragment } from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocale from "@dashboard/hooks/useLocale";
import useNavigator from "@dashboard/hooks/useNavigator";
import { messages as orderMessages } from "@dashboard/orders/components/OrderListDatagrid/messages";
import { type OrderLineLifecycle } from "@dashboard/orders/utils/buildOrderLineLifecycle";
import {
  getOrderLineFulfillUrl,
  getOrderLineReturnUrl,
  hasLineFulfillableItems,
  hasLineReturnableItems,
} from "@dashboard/orders/utils/getOrderLineActionUrls";
import { getOrderRefundNavigation } from "@dashboard/orders/utils/getOrderRefundNavigation";
import { productPath } from "@dashboard/products/urls";
import { ListViews } from "@dashboard/types";
import { type Item, type Theme } from "@glideapps/glide-data-grid";
import { Box, useTheme, type vars } from "@saleor/macaw-ui-next";
import { ExternalLink, PackageIcon, Undo2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useIntl } from "react-intl";

import { RefundedIcon } from "../../../icons/RefundedIcon";
import {
  createGetCellContent,
  getMatrixColumnTooltipContent,
  isLineDiscounted,
  isPinnedMatrixColumn,
  isPriceBreakdownColumn,
  mapPinnedGridColumnMove,
  MATRIX_PRODUCT_COLUMN_MIGRATION_KEY,
  orderLineMatrixStaticColumnsAdapter,
  PINNED_MATRIX_COLUMN_IDS,
  shouldMigrateMatrixProductColumn,
  STATUS_COLUMN_ID,
  withMigratedProductColumn,
} from "./datagrid";
import { messages } from "./messages";
import styles from "./OrderLineMatrixDatagrid.module.css";
import { OrderLineMatrixRowActions } from "./OrderLineMatrixRowActions";

interface OrderLineMatrixDatagridProps {
  order: OrderDetailsFragment;
  lines: OrderLineLifecycle[];
  loading: boolean;
  expandedLineId: string | null;
  onToggleExpand: (lineId: string) => void;
  onOrderLineShowMetadata: (id: string) => void;
  onShowLinePriceBreakdown?: (lineId: string) => void;
  needsActionOnly?: boolean;
  emptyText?: string;
  columnPickerBackgroundColor?: keyof typeof vars.colors.background;
  datagridCustomTheme?: Partial<Theme>;
}

const ROW_CLICK_DRAG_THRESHOLD_PX = 6;

export const OrderLineMatrixDatagrid = ({
  order,
  lines,
  loading,
  expandedLineId,
  onToggleExpand,
  onOrderLineShowMetadata,
  onShowLinePriceBreakdown,
  needsActionOnly = false,
  emptyText,
  columnPickerBackgroundColor = "default1",
  datagridCustomTheme = {},
}: OrderLineMatrixDatagridProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { locale } = useLocale();
  const { themeValues } = useTheme();
  const datagrid = useDatagridChangeState();
  const pointerInteractionRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    dragged: false,
  });
  const pointerCleanupRef = useRef<(() => void) | null>(null);
  const { updateListSettings, settings } = useListSettings(ListViews.ORDER_LINE_MATRIX_LIST);
  const orderLineMatrixStaticColumns = useMemo(
    () => orderLineMatrixStaticColumnsAdapter(intl),
    [intl],
  );

  useEffect(
    function migrateUnpinnedProductColumn() {
      if (window.localStorage.getItem(MATRIX_PRODUCT_COLUMN_MIGRATION_KEY)) {
        return;
      }

      const columns = settings?.columns;

      if (columns === undefined) {
        return;
      }

      if (columns.length === 0) {
        window.localStorage.setItem(MATRIX_PRODUCT_COLUMN_MIGRATION_KEY, "1");

        return;
      }

      if (shouldMigrateMatrixProductColumn(columns)) {
        updateListSettings?.("columns", withMigratedProductColumn(columns));
      }

      window.localStorage.setItem(MATRIX_PRODUCT_COLUMN_MIGRATION_KEY, "1");
    },
    [settings?.columns, updateListSettings],
  );

  const handleColumnChange = useCallback(
    (picked: string[]) => {
      if (updateListSettings) {
        updateListSettings(
          "columns",
          picked.filter(column => column && !isPinnedMatrixColumn(column)),
        );
      }
    },
    [updateListSettings],
  );
  const {
    handlers,
    visibleColumns,
    staticColumns,
    selectedColumns: pickedColumns,
    recentlyAddedColumn,
  } = useColumns({
    gridName: "order_line_matrix",
    staticColumns: orderLineMatrixStaticColumns,
    selectedColumns: settings?.columns ?? [],
    onSave: handleColumnChange,
    newColumnPosition: "end",
  });
  const columnsWithPinned = useMemo(() => {
    const pinnedColumns = PINNED_MATRIX_COLUMN_IDS.map(columnId =>
      orderLineMatrixStaticColumns.find(column => column.id === columnId),
    ).filter(Boolean);
    const remainingColumns = visibleColumns.filter(column => !isPinnedMatrixColumn(column.id));

    return [...pinnedColumns, ...remainingColumns];
  }, [orderLineMatrixStaticColumns, visibleColumns]);
  const highlightedRow = useMemo(() => {
    if (!expandedLineId) {
      return undefined;
    }

    const rowIndex = lines.findIndex(line => line.orderLineId === expandedLineId);

    return rowIndex >= 0 ? rowIndex : undefined;
  }, [expandedLineId, lines]);
  const getCellContent = useCallback(
    createGetCellContent({
      columns: columnsWithPinned,
      data: lines,
      loading,
      locale,
      intl,
      expandedLineId,
      interactivePricing: Boolean(onShowLinePriceBreakdown),
      needsActionOnly,
      mutedTextColor: themeValues.colors.text.default2,
    }),
    [
      columnsWithPinned,
      lines,
      loading,
      locale,
      intl,
      expandedLineId,
      onShowLinePriceBreakdown,
      needsActionOnly,
      themeValues.colors.text.default2,
    ],
  );
  const handleColumnMoved = useCallback(
    (startIndex: number, endIndex: number) => {
      const mappedMove = mapPinnedGridColumnMove(
        startIndex,
        endIndex,
        PINNED_MATRIX_COLUMN_IDS.length,
      );

      if (!mappedMove) {
        return;
      }

      handlers.onMove(mappedMove.startIndex, mappedMove.endIndex);
    },
    [handlers.onMove],
  );

  useEffect(
    () => () => {
      pointerCleanupRef.current?.();
    },
    [],
  );

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    pointerCleanupRef.current?.();

    const startX = event.clientX;
    const startY = event.clientY;
    let dragged = false;

    pointerInteractionRef.current = {
      active: true,
      startX,
      startY,
      dragged: false,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (dragged) {
        return;
      }

      const deltaX = Math.abs(moveEvent.clientX - startX);
      const deltaY = Math.abs(moveEvent.clientY - startY);

      if (deltaX > ROW_CLICK_DRAG_THRESHOLD_PX || deltaY > ROW_CLICK_DRAG_THRESHOLD_PX) {
        dragged = true;
        pointerInteractionRef.current.dragged = true;
      }
    };

    const handlePointerEnd = () => {
      pointerInteractionRef.current.active = false;
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerEnd);
      document.removeEventListener("pointercancel", handlePointerEnd);
      pointerCleanupRef.current = null;
    };

    pointerCleanupRef.current = handlePointerEnd;
    document.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerup", handlePointerEnd);
    document.addEventListener("pointercancel", handlePointerEnd);
  }, []);

  const handleLineInteraction = useCallback(
    ([col, row]: Item) => {
      if (pointerInteractionRef.current.dragged) {
        pointerInteractionRef.current.dragged = false;

        return;
      }

      const columnId = columnsWithPinned[col]?.id;
      const lifecycle = lines[row];

      if (!lifecycle) {
        return;
      }

      if (columnId === STATUS_COLUMN_ID) {
        onToggleExpand(lifecycle.orderLineId);

        return;
      }

      if (isPriceBreakdownColumn(columnId)) {
        const line = lifecycle.orderLine;

        if (line && isLineDiscounted(line)) {
          onShowLinePriceBreakdown?.(line.id);

          return;
        }
      }

      onToggleExpand(lifecycle.orderLineId);
    },
    [columnsWithPinned, lines, onShowLinePriceBreakdown, onToggleExpand],
  );
  const getLineMenuItems = useCallback(
    (index: number): TopNavMenuItem[] => {
      const lifecycle = lines[index];
      const lineId = lifecycle?.orderLineId;
      const productId = lifecycle?.orderLine.variant?.product.id;
      const items: TopNavMenuItem[] = [
        {
          label: intl.formatMessage(messages.productDetails),
          testId: "matrix-product-details",
          disabled: !productId,
          icon: <ExternalLink size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
          onSelect: () => {
            if (productId) {
              window.open(productPath(productId), "_blank", "noopener,noreferrer");
            }
          },
        },
      ];

      if (lineId && hasLineFulfillableItems(order, lineId)) {
        items.push({
          label: intl.formatMessage(messages.fulfillLine),
          testId: "matrix-fulfill-line",
          icon: <PackageIcon size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
          onSelect: () => {
            navigate(getOrderLineFulfillUrl(order.id, lineId));
          },
        });
      }

      if (lineId && hasLineReturnableItems(order, lineId)) {
        items.push({
          label: intl.formatMessage(messages.returnLine),
          testId: "matrix-return-line",
          icon: <Undo2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
          onSelect: () => {
            navigate(getOrderLineReturnUrl(order.id, lineId));
          },
        });
      }

      if (lineId) {
        const refundNavigation = getOrderRefundNavigation(order, { lineId });

        if (refundNavigation.canRefund) {
          items.push({
            label: intl.formatMessage(messages.refundLine),
            testId: "matrix-refund-line",
            icon: <RefundedIcon size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
            onSelect: () => {
              navigate(refundNavigation.url);
            },
          });
        }
      }

      return items;
    },
    [intl, lines, navigate, order],
  );
  const getMenuItems = useCallback(
    (index: number): CardMenuItem[] =>
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
      <OrderLineMatrixRowActions
        key={`matrix-row-actions-${index}`}
        menuItems={getLineMenuItems(index)}
        onShowMetadata={() => {
          if (lines[index]) {
            onOrderLineShowMetadata(lines[index].orderLineId);
          }
        }}
        disabled={loading}
        intl={intl}
      />
    ),
    [getLineMenuItems, lines, onOrderLineShowMetadata, loading, intl],
  );
  const handleGetColumnTooltipContent = useCallback(
    (colIndex: number) => getMatrixColumnTooltipContent(columnsWithPinned[colIndex]?.id, intl),
    [columnsWithPinned, intl],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Box
        className={styles.wrapper}
        position="relative"
        borderWidth={1}
        borderStyle="solid"
        borderColor="default1"
        borderRadius={4}
        onPointerDown={handlePointerDown}
      >
        <Box className={styles.datagridContainer}>
          <Datagrid
            showEmptyDatagrid
            highlightedRow={highlightedRow}
            themeOverride={datagridCustomTheme}
            rowMarkers="none"
            columnSelect="single"
            freezeColumns={1}
            availableColumns={columnsWithPinned}
            verticalBorder={false}
            showTopBorder={false}
            emptyText={emptyText ?? intl.formatMessage(orderMessages.emptyText)}
            getCellContent={getCellContent}
            getCellError={() => false}
            getColumnTooltipContent={handleGetColumnTooltipContent}
            menuItems={getMenuItems}
            rows={loading ? 1 : lines.length}
            selectionActions={() => null}
            onColumnResize={handlers.onResize}
            onColumnMoved={handleColumnMoved}
            recentlyAddedColumn={recentlyAddedColumn}
            renderColumnPicker={() => (
              <ColumnPicker
                staticColumns={staticColumns.filter(column => !isPinnedMatrixColumn(column.id))}
                selectedColumns={pickedColumns.filter(column => !isPinnedMatrixColumn(column))}
                onToggle={handlers.onToggle}
                align="end"
                backgroundColor={columnPickerBackgroundColor}
              />
            )}
            renderRowActions={renderRowActions}
            rowActionBarWidth={ROW_ACTION_BAR_WIDTH}
            onRowClick={handleLineInteraction}
            onCellActivated={handleLineInteraction}
          />
        </Box>
      </Box>
    </DatagridChangeStateContext.Provider>
  );
};
