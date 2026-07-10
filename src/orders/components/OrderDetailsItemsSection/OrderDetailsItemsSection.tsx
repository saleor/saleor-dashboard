// @ts-strict-ignore
import { type OrderDetailsFragment, type OrderDetailsQuery } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { hasAnyItemsReplaceable } from "@dashboard/orders/components/OrderDetailsPage/utils";
import { OrderFulfillmentCard } from "@dashboard/orders/components/OrderFulfillmentCard/OrderFulfillmentCard";
import { OrderLineExpandedPanel } from "@dashboard/orders/components/OrderLineExpandedPanel/OrderLineExpandedPanel";
import { OrderLineMatrixDatagrid } from "@dashboard/orders/components/OrderLineMatrixDatagrid/OrderLineMatrixDatagrid";
import { OrderUnfulfilledProductsCard } from "@dashboard/orders/components/OrderUnfulfilledProductsCard/OrderUnfulfilledProductsCard";
import { rippleOrderLineMatrixView } from "@dashboard/orders/ripples/orderLineMatrixView";
import { buildOrderLineLifecycle } from "@dashboard/orders/utils/buildOrderLineLifecycle";
import {
  getOrderDetailsViewMode,
  type OrderDetailsViewMode,
  setOrderDetailsViewMode,
} from "@dashboard/orders/utils/orderDetailsViewMode";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { Box, Button, Text, Tooltip } from "@saleor/macaw-ui-next";
import { PackageIcon, Undo2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

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
  const [viewMode, setViewMode] = useState<OrderDetailsViewMode>(getOrderDetailsViewMode);
  const [expandedLineId, setExpandedLineId] = useState<string | null>(null);
  const unfulfilled = useMemo(
    () => (order.lines || []).filter(line => line.quantityToFulfill > 0),
    [order.lines],
  );
  const lifecycleRows = useMemo(() => buildOrderLineLifecycle(order), [order]);
  const expandedLifecycle = lifecycleRows.find(row => row.orderLineId === expandedLineId);
  const hasItemsToFulfill = lifecycleRows.some(row => row.toFulfill > 0);
  const canReturn = hasAnyItemsReplaceable(order);

  const handleViewModeChange = useCallback((mode: OrderDetailsViewMode) => {
    setOrderDetailsViewMode(mode);
    setViewMode(mode);
    setExpandedLineId(null);
  }, []);

  const handleToggleExpand = useCallback((lineId: string) => {
    setExpandedLineId(current => (current === lineId ? null : lineId));
  }, []);

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
            showBottomSeparator={(order.fulfillments?.length ?? 0) > 0}
          />
          {order.fulfillments?.map((fulfillment, index) => (
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
              showBottomSeparator={index < (order.fulfillments?.length ?? 0) - 1}
            />
          ))}
        </>
      ) : (
        <Box paddingX={6} display="flex" flexDirection="column" gap={4}>
          <Text size={3} color="default2">
            <FormattedMessage {...messages.matrixHelper} />
          </Text>
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
