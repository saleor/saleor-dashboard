// @ts-strict-ignore
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import { ROW_ACTION_BAR_WIDTH } from "@dashboard/components/Datagrid/const";
import { Datagrid } from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { useEmptyColumn } from "@dashboard/components/Datagrid/hooks/useEmptyColumn";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocale from "@dashboard/hooks/useLocale";
import { messages as orderMessages } from "@dashboard/orders/components/OrderListDatagrid/messages";
import { type OrderLineLifecycle } from "@dashboard/orders/utils/buildOrderLineLifecycle";
import { productPath } from "@dashboard/products/urls";
import { ListViews } from "@dashboard/types";
import { type Item, type Theme } from "@glideapps/glide-data-grid";
import { Box, type vars } from "@saleor/macaw-ui-next";
import { ExternalLink } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { OrderDetailsRowActions } from "../OrderDetailsDatagrid/OrderDetailsRowActions";
import {
  createGetCellContent,
  getMatrixColumnTooltipContent,
  isLineDiscounted,
  isPinnedMatrixColumn,
  isPriceBreakdownColumn,
  orderLineMatrixStaticColumnsAdapter,
  PINNED_MATRIX_COLUMN_IDS,
  STATUS_COLUMN_ID,
} from "./datagrid";
import { messages } from "./messages";
import styles from "./OrderLineMatrixDatagrid.module.css";

interface OrderLineMatrixDatagridProps {
  lines: OrderLineLifecycle[];
  loading: boolean;
  expandedLineId: string | null;
  onToggleExpand: (lineId: string) => void;
  onOrderLineShowMetadata: (id: string) => void;
  onShowLinePriceBreakdown?: (lineId: string) => void;
  columnPickerBackgroundColor?: keyof typeof vars.colors.background;
  datagridCustomTheme?: Partial<Theme>;
}

const MATRIX_SCROLL_MAX_HEIGHT = "min(70vh, 720px)";

export const OrderLineMatrixDatagrid = ({
  lines,
  loading,
  expandedLineId,
  onToggleExpand,
  onOrderLineShowMetadata,
  onShowLinePriceBreakdown,
  columnPickerBackgroundColor = "default1",
  datagridCustomTheme = {},
}: OrderLineMatrixDatagridProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const datagrid = useDatagridChangeState();
  const { updateListSettings, settings } = useListSettings(ListViews.ORDER_LINE_MATRIX_LIST);
  const emptyColumn = useEmptyColumn();
  const orderLineMatrixStaticColumns = useMemo(
    () => orderLineMatrixStaticColumnsAdapter(intl, emptyColumn),
    [intl, emptyColumn],
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
  const { handlers, visibleColumns, staticColumns, selectedColumns, recentlyAddedColumn } =
    useColumns({
      gridName: "order_line_matrix",
      staticColumns: orderLineMatrixStaticColumns,
      selectedColumns: settings?.columns ?? [],
      onSave: handleColumnChange,
    });
  const columnsWithPinned = useMemo(() => {
    const emptyColumnDef = visibleColumns.find(column => column.id === "empty");
    const pinnedColumns = PINNED_MATRIX_COLUMN_IDS.map(columnId =>
      orderLineMatrixStaticColumns.find(column => column.id === columnId),
    ).filter(Boolean);
    const remainingColumns = visibleColumns.filter(
      column => column.id !== "empty" && !isPinnedMatrixColumn(column.id),
    );

    return [...(emptyColumnDef ? [emptyColumnDef] : []), ...pinnedColumns, ...remainingColumns];
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
    }),
    [columnsWithPinned, lines, loading, locale, intl, expandedLineId, onShowLinePriceBreakdown],
  );
  const getMenuItems = useCallback(
    (index: number) => {
      const productId = lines[index]?.orderLine.variant?.product.id;

      return [
        {
          disabled: !productId,
          label: intl.formatMessage(messages.productDetails),
          Icon: productId ? (
            <Link to={productPath(productId)} target="_blank">
              <ExternalLink size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
            </Link>
          ) : (
            <ExternalLink size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
          ),
          onSelect: () => false,
        },
      ];
    },
    [intl, lines],
  );
  const renderRowActions = useCallback(
    (index: number) => (
      <OrderDetailsRowActions
        key={`matrix-row-actions-${index}`}
        menuItems={getMenuItems(index)}
        onShowMetadata={() => {
          if (lines[index]) {
            onOrderLineShowMetadata(lines[index].orderLineId);
          }
        }}
        disabled={loading}
        intl={intl}
      />
    ),
    [getMenuItems, lines, onOrderLineShowMetadata, loading, intl],
  );
  const handleRowClick = useCallback(
    ([col, row]: Item) => {
      const columnId = columnsWithPinned[col]?.id;

      if (columnId === STATUS_COLUMN_ID) {
        const line = lines[row];

        if (line) {
          onToggleExpand(line.orderLineId);
        }

        return;
      }

      if (!isPriceBreakdownColumn(columnId)) {
        return;
      }

      const line = lines[row]?.orderLine;

      if (!line || !isLineDiscounted(line)) {
        return;
      }

      onShowLinePriceBreakdown?.(line.id);
    },
    [columnsWithPinned, lines, onShowLinePriceBreakdown, onToggleExpand],
  );
  const handleGetColumnTooltipContent = useCallback(
    (colIndex: number) => getMatrixColumnTooltipContent(columnsWithPinned[colIndex]?.id, intl),
    [columnsWithPinned, intl],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Box
        className={styles.wrapper}
        borderWidth={1}
        borderStyle="solid"
        borderColor="default1"
        borderRadius={4}
      >
        <Box
          className={styles.scrollContainer}
          overflow="auto"
          __maxHeight={MATRIX_SCROLL_MAX_HEIGHT}
        >
          <Datagrid
            showEmptyDatagrid
            hasRowHover
            highlightedRow={highlightedRow}
            themeOverride={datagridCustomTheme}
            rowMarkers="none"
            columnSelect="single"
            freezeColumns={3}
            availableColumns={columnsWithPinned}
            verticalBorder={false}
            showTopBorder={false}
            emptyText={intl.formatMessage(orderMessages.emptyText)}
            getCellContent={getCellContent}
            getCellError={() => false}
            getColumnTooltipContent={handleGetColumnTooltipContent}
            menuItems={getMenuItems}
            rows={loading ? 1 : lines.length}
            selectionActions={() => null}
            onColumnResize={handlers.onResize}
            onColumnMoved={handlers.onMove}
            recentlyAddedColumn={recentlyAddedColumn}
            renderColumnPicker={() => (
              <ColumnPicker
                staticColumns={staticColumns.filter(column => !isPinnedMatrixColumn(column.id))}
                selectedColumns={selectedColumns.filter(column => !isPinnedMatrixColumn(column))}
                onToggle={handlers.onToggle}
                align="end"
                backgroundColor={columnPickerBackgroundColor}
              />
            )}
            renderRowActions={renderRowActions}
            rowActionBarWidth={ROW_ACTION_BAR_WIDTH}
            onRowClick={handleRowClick}
            onCellActivated={handleRowClick}
          />
        </Box>
      </Box>
    </DatagridChangeStateContext.Provider>
  );
};
