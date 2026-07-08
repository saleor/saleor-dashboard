import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import { ROW_ACTION_BAR_WIDTH } from "@dashboard/components/Datagrid/const";
import { Datagrid } from "@dashboard/components/Datagrid/Datagrid";
import {
  type DatagridChangeOpts,
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { useEmptyColumn } from "@dashboard/components/Datagrid/hooks/useEmptyColumn";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { type OrderDetailsFragment, type OrderErrorFragment } from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import { OrderLineDiscountModal } from "@dashboard/orders/components/OrderDiscountModal/OrderLineDiscountModal";
import { type OrderDiscountCommonInput } from "@dashboard/orders/components/OrderDiscountModal/types";
import { useOrderLineDiscountContext } from "@dashboard/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import { productUrl } from "@dashboard/products/urls";
import { ListViews } from "@dashboard/types";
import { type Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui-next";
import { ExternalLink, Percent, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { type FormData } from "../OrderDraftDetailsProducts/OrderDraftDetailsProducts";
import { OrderDraftLineRemoveDialog } from "../OrderDraftLineRemoveDialog/OrderDraftLineRemoveDialog";
import { orderDraftDetailsStaticColumnsAdapter, useGetCellContent } from "./datagrid";
import { messages } from "./messages";
import { OrderDraftDetailsRowActions } from "./OrderDraftDetailsRowActions";

interface OrderDraftDetailsDatagridProps {
  loading: boolean;
  lines: OrderDetailsFragment["lines"];
  errors: OrderErrorFragment[];
  orderLineRemoveConfirmState?: ConfirmButtonTransitionState;
  orderLineRemoveErrors?: OrderErrorFragment[];
  onOrderLineChange: (id: string, data: FormData) => void;
  onOrderLineRemove: (id: string) => void;
  onOrderLineShowMetadata: (id: string) => void;
}

export const OrderDraftDetailsDatagrid = ({
  lines,
  errors,
  orderLineRemoveConfirmState = "default",
  orderLineRemoveErrors = [],
  onOrderLineChange,
  onOrderLineRemove,
  onOrderLineShowMetadata,
}: OrderDraftDetailsDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();
  const removeRequestedRef = useRef(false);
  const { updateListSettings, settings } = useListSettings(ListViews.ORDER_DRAFT_DETAILS_LIST);
  const getDiscountProviderValues = useOrderLineDiscountContext();
  const [discountedLineId, setDiscountedLineId] = useState<string | null>(null);
  const [lineToRemoveId, setLineToRemoveId] = useState<string | null>(null);

  const discountProviderValues = discountedLineId
    ? getDiscountProviderValues(discountedLineId)
    : null;
  const lineToRemove = useMemo(
    () => lines.find(line => line.id === lineToRemoveId),
    [lineToRemoveId, lines],
  );
  const discountedLineData = useMemo(() => {
    const line = lines.find(l => l.id === discountedLineId);

    if (!line) return undefined;

    return {
      productName: line.productName,
      variantName: line.variant?.name,
      productSku: line.productSku,
      quantity: line.quantity,
      thumbnail: line.thumbnail,
    };
  }, [lines, discountedLineId]);
  const emptyColumn = useEmptyColumn();
  const orderDraftDetailsStaticColumns = useMemo(
    () => orderDraftDetailsStaticColumnsAdapter(emptyColumn, intl),
    [emptyColumn, intl],
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
      gridName: "order_draft_details_products",
      staticColumns: orderDraftDetailsStaticColumns,
      selectedColumns: settings?.columns ?? [],
      onSave: handleColumnChange,
    });
  const getCellContent = useGetCellContent({
    columns: visibleColumns,
    lines,
    errors,
  });
  const getMenuItems = useCallback(
    (index: number) => [
      {
        label: intl.formatMessage(messages.productDetails),
        testId: "open-product-details",
        disabled: !lines[index]?.variant?.product.id,
        Icon: <ExternalLink size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
        onSelect: () => {
          const productId = lines[index]?.variant?.product.id;

          if (productId) {
            window.open(productUrl(productId), "_blank", "noopener,noreferrer");
          }
        },
      },
      {
        label: intl.formatMessage(
          lines[index]?.discounts?.some(d => d.type === "MANUAL")
            ? messages.editDiscount
            : messages.addDiscount,
        ),
        testId: "edit-order-line-discount",
        Icon: <Percent size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
        onSelect: () => {
          setDiscountedLineId(lines[index].id);
        },
      },
      {
        label: intl.formatMessage(messages.deleteOrder),
        testId: "delete-order-line",
        Icon: (
          <Box as="span" color="critical1">
            <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
          </Box>
        ),
        onSelect: () => {
          setLineToRemoveId(lines[index].id);
        },
      },
    ],
    [intl, lines],
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

  const handleDiscountConfirm = useCallback(
    async (discount: OrderDiscountCommonInput) => {
      await discountProviderValues?.addOrderLineDiscount(discount);
      setDiscountedLineId(null);
    },
    [discountProviderValues],
  );

  const handleDiscountRemove = useCallback(async () => {
    await discountProviderValues?.removeOrderLineDiscount();
    setDiscountedLineId(null);
  }, [discountProviderValues]);

  const handleDiscountClose = useCallback(() => {
    setDiscountedLineId(null);
  }, []);

  const handleCloseRemoveDialog = useCallback(() => {
    if (orderLineRemoveConfirmState === "loading") {
      return;
    }

    setLineToRemoveId(null);
  }, [orderLineRemoveConfirmState]);

  const handleConfirmRemove = useCallback(() => {
    if (!lineToRemoveId) {
      return;
    }

    removeRequestedRef.current = true;
    onOrderLineRemove(lineToRemoveId);
  }, [lineToRemoveId, onOrderLineRemove]);

  useEffect(() => {
    if (!removeRequestedRef.current || !lineToRemoveId) {
      return;
    }

    if (orderLineRemoveConfirmState === "success") {
      removeRequestedRef.current = false;
      setLineToRemoveId(null);
    }

    if (orderLineRemoveConfirmState === "error") {
      removeRequestedRef.current = false;
    }
  }, [lineToRemoveId, orderLineRemoveConfirmState]);

  useEffect(() => {
    if (!lineToRemoveId) {
      removeRequestedRef.current = false;
    }
  }, [lineToRemoveId]);

  const handleRowClick = useCallback(
    (item: Item) => {
      const [columnIndex, rowIndex] = item;
      const column = visibleColumns[columnIndex];

      if (column?.id === "price" && lines[rowIndex]) {
        setDiscountedLineId(lines[rowIndex].id);
      }
    },
    [visibleColumns, lines],
  );

  const renderRowActions = useCallback(
    (index: number) => (
      <OrderDraftDetailsRowActions
        menuItems={getMenuItems(index)}
        onShowMetadata={() => onOrderLineShowMetadata(lines[index].id)}
        intl={intl}
        showDiscountRipple={index === 0}
      />
    ),
    [getMenuItems, intl, lines, onOrderLineShowMetadata],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        rowMarkers="none"
        columnSelect="single"
        freezeColumns={2}
        verticalBorder={false}
        showTopBorder={false}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.emptyText)}
        getCellContent={getCellContent}
        getCellError={() => false}
        menuItems={getMenuItems}
        rows={lines.length}
        selectionActions={() => null}
        onColumnResize={handlers.onResize}
        onColumnMoved={handlers.onMove}
        onRowClick={handleRowClick}
        recentlyAddedColumn={recentlyAddedColumn}
        renderColumnPicker={() => (
          <ColumnPicker
            selectedColumns={selectedColumns}
            staticColumns={staticColumns}
            onToggle={handlers.onToggle}
            align="end"
            backgroundColor="default1"
          />
        )}
        onChange={handleDatagridChange}
        renderRowActions={renderRowActions}
        rowActionBarWidth={ROW_ACTION_BAR_WIDTH}
      />
      {discountProviderValues && discountedLineId && (
        <OrderLineDiscountModal
          open={!!discountedLineId}
          maxPrice={discountProviderValues.unitUndiscountedPrice}
          automaticDiscounts={discountProviderValues.automaticDiscounts}
          lineData={discountedLineData}
          existingDiscount={discountProviderValues.orderLineDiscount}
          confirmStatus={discountProviderValues.orderLineDiscountUpdateStatus}
          removeStatus={discountProviderValues.orderLineDiscountRemoveStatus}
          onConfirm={handleDiscountConfirm}
          onRemove={handleDiscountRemove}
          onClose={handleDiscountClose}
        />
      )}
      <OrderDraftLineRemoveDialog
        confirmButtonState={orderLineRemoveConfirmState}
        errors={orderLineRemoveErrors}
        open={!!lineToRemoveId}
        productName={
          lineToRemove?.productName ?? intl.formatMessage(messages.unknownProductFallback)
        }
        onClose={handleCloseRemoveDialog}
        onConfirm={handleConfirmRemove}
      />
    </DatagridChangeStateContext.Provider>
  );
};
