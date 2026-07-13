// @ts-strict-ignore
import {
  InsetSegmentedControl,
  type InsetSegmentedControlOption,
  insetSegmentLabel,
} from "@dashboard/components/InsetSegmentedControl/InsetSegmentedControl";
import {
  FulfillmentStatus,
  type OrderDetailsFragment,
  type OrderDetailsQuery,
} from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { hasAnyItemsReplaceable } from "@dashboard/orders/components/OrderDetailsPage/utils";
import { OrderFulfillmentCard } from "@dashboard/orders/components/OrderFulfillmentCard/OrderFulfillmentCard";
import { OrderLineExpandedPanel } from "@dashboard/orders/components/OrderLineExpandedPanel/OrderLineExpandedPanel";
import { OrderLineMatrixDatagrid } from "@dashboard/orders/components/OrderLineMatrixDatagrid/OrderLineMatrixDatagrid";
import { OrderLineMatrixNeedsActionSwitch } from "@dashboard/orders/components/OrderLineMatrixDatagrid/OrderLineMatrixNeedsActionSwitch";
import { OrderUnfulfilledProductsCard } from "@dashboard/orders/components/OrderUnfulfilledProductsCard/OrderUnfulfilledProductsCard";
import { useOrderDetailsViewMode } from "@dashboard/orders/hooks/useOrderDetailsViewMode";
import { rippleOrderLineMatrixView } from "@dashboard/orders/ripples/orderLineMatrixView";
import { buildOrderLineLifecycle } from "@dashboard/orders/utils/buildOrderLineLifecycle";
import { getOrderLineDisplayName } from "@dashboard/orders/utils/data";
import { getOrderLevelGrantedRefundsNeedingAttention } from "@dashboard/orders/utils/getOrderLevelGrantedRefunds";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { type OrderDetailsViewMode } from "@dashboard/types";
import { Box, Button, Text, Tooltip } from "@saleor/macaw-ui-next";
import { History, PackageIcon, Rows3, Undo2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import styles from "./OrderDetailsItemsSection.module.css";
import { OrderLevelRefundCallout } from "./OrderLevelRefundCallout";

const EXPANDED_PANEL_ID = "order-line-expanded-panel";

interface OrderDetailsItemsSectionProps {
  order: OrderDetailsFragment;
  shop: OrderDetailsQuery["shop"];
  loading: boolean;
  canFulfill: boolean;
  notAllowedToFulfillUnpaid: boolean;
  onOrderFulfill: () => void;
  onOrderReturn: () => void;
  onFulfillmentApprove: (id: string) => void;
  onFulfillmentCancel: (id: string) => void;
  onFulfillmentTrackingNumberUpdate: (id: string) => void;
  onOrderLineShowMetadata: (id: string) => void;
  onFulfillmentShowMetadata: (id: string) => void;
  onShowLinePriceBreakdown?: (lineId: string) => void;
  focusedLineId?: string;
  onFocusedLineChange?: (lineId: string | null) => void;
}

export const OrderDetailsItemsSection = ({
  order,
  shop,
  loading,
  canFulfill,
  notAllowedToFulfillUnpaid,
  onOrderFulfill,
  onOrderReturn,
  onFulfillmentApprove,
  onFulfillmentCancel,
  onFulfillmentTrackingNumberUpdate,
  onOrderLineShowMetadata,
  onFulfillmentShowMetadata,
  onShowLinePriceBreakdown,
  focusedLineId,
  onFocusedLineChange,
}: OrderDetailsItemsSectionProps) => {
  const intl = useIntl();
  const { viewMode, setViewMode, showCanceledFulfillments, setShowCanceledFulfillments } =
    useOrderDetailsViewMode();
  const [expandedLineId, setExpandedLineId] = useState<string | null>(null);
  const [needsActionOnly, setNeedsActionOnly] = useState(false);
  const unfulfilled = useMemo(
    () => (order.lines || []).filter(line => line.quantityToFulfill > 0),
    [order.lines],
  );
  const { activeFulfillments, canceledFulfillments } = useMemo(() => {
    const fulfillments = order.fulfillments ?? [];

    return {
      activeFulfillments: fulfillments.filter(
        fulfillment => fulfillment.status !== FulfillmentStatus.CANCELED,
      ),
      canceledFulfillments: fulfillments.filter(
        fulfillment => fulfillment.status === FulfillmentStatus.CANCELED,
      ),
    };
  }, [order.fulfillments]);
  const lifecycleRows = useMemo(() => buildOrderLineLifecycle(order), [order]);
  const orderLevelRefunds = useMemo(
    () => getOrderLevelGrantedRefundsNeedingAttention(order),
    [order],
  );
  const expandedLifecycle = lifecycleRows.find(row => row.orderLineId === expandedLineId);
  const expandedProductName = expandedLifecycle
    ? getOrderLineDisplayName({
        productName: expandedLifecycle.orderLine.productName,
        variant: expandedLifecycle.orderLine.variant,
      })
    : "";
  const hasItemsToFulfill = lifecycleRows.some(row => row.toFulfill > 0);
  const canReturn = hasAnyItemsReplaceable(order);

  const handleViewModeChange = useCallback(
    (mode: OrderDetailsViewMode) => {
      setViewMode(mode);
      setExpandedLineId(null);
      onFocusedLineChange?.(null);
      setNeedsActionOnly(false);
    },
    [onFocusedLineChange, setViewMode],
  );

  useEffect(() => {
    if (!onFocusedLineChange) {
      return;
    }

    if (!focusedLineId) {
      setExpandedLineId(null);

      return;
    }

    const lineExists = lifecycleRows.some(row => row.orderLineId === focusedLineId);

    if (!lineExists) {
      onFocusedLineChange?.(null);

      return;
    }

    // Guard against re-triggering: setViewMode always creates a new settings
    // object (and writes to localStorage), so calling it unconditionally here
    // would re-render and re-run this effect in an endless loop while a line
    // is focused, saturating the main thread and making grid scroll janky.
    if (viewMode !== "matrix") {
      setViewMode("matrix");
    }

    setExpandedLineId(focusedLineId);
  }, [focusedLineId, lifecycleRows, onFocusedLineChange, setViewMode, viewMode]);

  const viewModeOptions = useMemo(
    (): InsetSegmentedControlOption<OrderDetailsViewMode>[] => [
      {
        value: "timeline",
        testId: "order-items-view-timeline",
        label: isActive => (
          <Box display="flex" alignItems="center" gap={1.5}>
            <History size={14} />
            {insetSegmentLabel(isActive, intl.formatMessage(messages.timeline))}
          </Box>
        ),
      },
      {
        value: "matrix",
        testId: "order-items-view-matrix",
        label: isActive => (
          <Box display="flex" alignItems="center" gap={1.5}>
            <Rows3 size={14} />
            {insetSegmentLabel(isActive, intl.formatMessage(messages.lineMatrix))}
          </Box>
        ),
      },
    ],
    [intl],
  );

  const handleNeedsActionOnlyChange = useCallback((value: boolean) => {
    setNeedsActionOnly(value);
  }, []);

  const handleToggleExpand = useCallback(
    (lineId: string) => {
      const nextLineId = expandedLineId === lineId ? null : lineId;

      setExpandedLineId(nextLineId);
      onFocusedLineChange?.(nextLineId);
    },
    [expandedLineId, onFocusedLineChange],
  );

  const renderFulfillmentCard = (
    fulfillment: NonNullable<OrderDetailsFragment["fulfillments"]>[number],
    index: number,
    total: number,
  ) => (
    <OrderFulfillmentCard
      key={fulfillment.id}
      dataTestId="fulfilled-order-section"
      fulfillment={fulfillment}
      fulfillmentAllowUnpaid={shop?.fulfillmentAllowUnpaid}
      order={order}
      onOrderLineShowMetadata={onOrderLineShowMetadata}
      onShowLinePriceBreakdown={onShowLinePriceBreakdown}
      onFulfillmentShowMetadata={() => onFulfillmentShowMetadata(fulfillment.id)}
      onOrderFulfillmentCancel={() => onFulfillmentCancel(fulfillment.id)}
      onTrackingCodeAdd={() => onFulfillmentTrackingNumberUpdate(fulfillment.id)}
      onOrderFulfillmentApprove={() => onFulfillmentApprove(fulfillment.id)}
      showBottomSeparator={index < total - 1}
    />
  );

  return (
    <Box data-test-id="order-details-items-section">
      <Box
        paddingTop={6}
        paddingX={6}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={4}
        marginBottom={4}
        flexWrap="wrap"
      >
        <Box className={styles.viewToggleAnchor}>
          <InsetSegmentedControl
            size="lg"
            value={viewMode}
            onChange={handleViewModeChange}
            options={viewModeOptions}
            aria-label={intl.formatMessage(messages.viewModeAriaLabel)}
            data-test-id="order-items-view-toggle"
          />
          <Box className={styles.viewToggleRipple} data-test-id="order-items-view-ripple">
            <Ripple model={rippleOrderLineMatrixView} />
          </Box>
        </Box>

        {viewMode === "matrix" && (hasItemsToFulfill || canReturn) && (
          <Box display="flex" gap={2}>
            {hasItemsToFulfill && canFulfill && (
              <Tooltip>
                <Tooltip.Trigger>
                  <Box>
                    <Button
                      variant="primary"
                      onClick={onOrderFulfill}
                      disabled={notAllowedToFulfillUnpaid}
                      data-test-id="matrix-fulfill-button"
                    >
                      <PackageIcon size={16} />
                      <FormattedMessage {...messages.fulfill} />
                    </Button>
                  </Box>
                </Tooltip.Trigger>
                {notAllowedToFulfillUnpaid && (
                  <Tooltip.Content>
                    <FormattedMessage {...commonMessages.cannotFullfillUnpaidOrder} />
                  </Tooltip.Content>
                )}
              </Tooltip>
            )}
            {canReturn && (
              <Button
                variant="secondary"
                onClick={onOrderReturn}
                data-test-id="matrix-return-button"
              >
                <Undo2 size={16} />
                <FormattedMessage {...messages.returnOrder} />
              </Button>
            )}
          </Box>
        )}
      </Box>

      {viewMode === "timeline" ? (
        <>
          <OrderUnfulfilledProductsCard
            showFulfillmentAction={canFulfill}
            notAllowedToFulfillUnpaid={notAllowedToFulfillUnpaid}
            lines={unfulfilled}
            onFulfill={onOrderFulfill}
            loading={loading}
            onOrderLineShowMetadata={onOrderLineShowMetadata}
            onShowLinePriceBreakdown={onShowLinePriceBreakdown}
            showBottomSeparator={activeFulfillments.length > 0 || canceledFulfillments.length > 0}
          />
          {activeFulfillments.map((fulfillment, index) =>
            renderFulfillmentCard(fulfillment, index, activeFulfillments.length),
          )}
          {canceledFulfillments.length > 0 && (
            <Box paddingX={6} paddingTop={4} paddingBottom={showCanceledFulfillments ? 4 : 6}>
              <Button
                variant="tertiary"
                onClick={() => setShowCanceledFulfillments(!showCanceledFulfillments)}
                data-test-id="toggle-canceled-fulfillments"
              >
                <FormattedMessage
                  {...(showCanceledFulfillments
                    ? messages.hideCanceledShipments
                    : messages.showCanceledShipments)}
                  values={{ count: canceledFulfillments.length }}
                />
              </Button>
            </Box>
          )}
          {showCanceledFulfillments &&
            canceledFulfillments.map((fulfillment, index) =>
              renderFulfillmentCard(fulfillment, index, canceledFulfillments.length),
            )}
        </>
      ) : (
        <Box
          paddingX={6}
          display="flex"
          flexDirection="column"
          gap={4}
          aria-expanded={expandedLineId !== null}
          aria-controls={expandedLineId ? EXPANDED_PANEL_ID : undefined}
        >
          <OrderLevelRefundCallout orderId={order.id} refunds={orderLevelRefunds} />
          <Box display="flex" alignItems="center" justifyContent="space-between" gap={4}>
            <Text size={3} color="default2">
              <FormattedMessage {...messages.matrixHelper} />
            </Text>
            <OrderLineMatrixNeedsActionSwitch
              pressed={needsActionOnly}
              onPressedChange={handleNeedsActionOnlyChange}
            />
          </Box>
          <div className={styles.srOnly} aria-live="polite">
            {expandedLifecycle && (
              <FormattedMessage
                {...messages.lineExpandedAnnouncement}
                values={{ productName: expandedProductName }}
              />
            )}
          </div>
          <OrderLineMatrixDatagrid
            order={order}
            lines={lifecycleRows}
            loading={loading}
            expandedLineId={expandedLineId}
            onToggleExpand={handleToggleExpand}
            onOrderLineShowMetadata={onOrderLineShowMetadata}
            onShowLinePriceBreakdown={onShowLinePriceBreakdown}
            needsActionOnly={needsActionOnly}
          />
          {expandedLifecycle && (
            <OrderLineExpandedPanel
              lifecycle={expandedLifecycle}
              order={order}
              fulfillmentAllowUnpaid={shop?.fulfillmentAllowUnpaid}
              panelId={EXPANDED_PANEL_ID}
              onOrderFulfillmentApprove={onFulfillmentApprove}
              onOrderFulfillmentCancel={onFulfillmentCancel}
              onTrackingCodeAdd={onFulfillmentTrackingNumberUpdate}
              onFulfillmentShowMetadata={onFulfillmentShowMetadata}
              showCanceledShipments={showCanceledFulfillments}
              onShowCanceledShipmentsChange={setShowCanceledFulfillments}
            />
          )}
        </Box>
      )}
    </Box>
  );
};
