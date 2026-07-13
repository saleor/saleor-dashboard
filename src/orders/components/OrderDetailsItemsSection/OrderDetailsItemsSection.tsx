// @ts-strict-ignore
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
import { OrderUnfulfilledProductsCard } from "@dashboard/orders/components/OrderUnfulfilledProductsCard/OrderUnfulfilledProductsCard";
import { useOrderDetailsViewMode } from "@dashboard/orders/hooks/useOrderDetailsViewMode";
import { rippleOrderLineMatrixView } from "@dashboard/orders/ripples/orderLineMatrixView";
import { buildOrderLineLifecycle } from "@dashboard/orders/utils/buildOrderLineLifecycle";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { Box, Button, Text, Tooltip } from "@saleor/macaw-ui-next";
import { PackageIcon, Undo2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";
import styles from "./OrderDetailsItemsSection.module.css";

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
}: OrderDetailsItemsSectionProps) => {
  const { viewMode, setViewMode } = useOrderDetailsViewMode();
  const [expandedLineId, setExpandedLineId] = useState<string | null>(null);
  const [showCanceledFulfillments, setShowCanceledFulfillments] = useState(false);
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
  const expandedLifecycle = lifecycleRows.find(row => row.orderLineId === expandedLineId);
  const expandedProductName = expandedLifecycle
    ? [expandedLifecycle.orderLine.productName, expandedLifecycle.orderLine.variant?.name]
        .filter(Boolean)
        .join(" / ")
    : "";
  const hasItemsToFulfill = lifecycleRows.some(row => row.toFulfill > 0);
  const canReturn = hasAnyItemsReplaceable(order);

  const handleViewModeChange = useCallback(
    (mode: Parameters<typeof setViewMode>[0]) => {
      setViewMode(mode);
      setExpandedLineId(null);
    },
    [setViewMode],
  );

  const handleToggleExpand = useCallback((lineId: string) => {
    setExpandedLineId(current => (current === lineId ? null : lineId));
  }, []);

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
        <Box display="flex" alignItems="center" gap={2}>
          <Box display="flex" gap={2} data-test-id="order-items-view-toggle">
            <Button
              variant={viewMode === "timeline" ? "primary" : "secondary"}
              onClick={() => handleViewModeChange("timeline")}
              data-test-id="order-items-view-timeline"
            >
              <FormattedMessage {...messages.timeline} />
            </Button>
            <Button
              variant={viewMode === "matrix" ? "primary" : "secondary"}
              onClick={() => handleViewModeChange("matrix")}
              data-test-id="order-items-view-matrix"
            >
              <FormattedMessage {...messages.lineMatrix} />
            </Button>
          </Box>
          <Ripple model={rippleOrderLineMatrixView} />
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
            <Box paddingX={6} paddingBottom={showCanceledFulfillments ? 0 : 6}>
              <Button
                variant="tertiary"
                onClick={() => setShowCanceledFulfillments(current => !current)}
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
          <Text size={3} color="default2">
            <FormattedMessage {...messages.matrixHelper} />
          </Text>
          <div className={styles.srOnly} aria-live="polite">
            {expandedLifecycle && (
              <FormattedMessage
                {...messages.lineExpandedAnnouncement}
                values={{ productName: expandedProductName }}
              />
            )}
          </div>
          <OrderLineMatrixDatagrid
            lines={lifecycleRows}
            loading={loading}
            expandedLineId={expandedLineId}
            onToggleExpand={handleToggleExpand}
            onOrderLineShowMetadata={onOrderLineShowMetadata}
            onShowLinePriceBreakdown={onShowLinePriceBreakdown}
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
            />
          )}
        </Box>
      )}
    </Box>
  );
};
