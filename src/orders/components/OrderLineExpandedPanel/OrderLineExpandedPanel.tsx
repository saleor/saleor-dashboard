// @ts-strict-ignore
import { FormatDate } from "@dashboard/components/Date/FormatDate";
import { iconSize, iconStrokeWidth, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { formatMoneyAmount } from "@dashboard/components/Money";
import { FulfillmentStatus, type OrderDetailsFragment } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import useNavigator from "@dashboard/hooks/useNavigator";
import { buttonMessages } from "@dashboard/intl";
import { getById } from "@dashboard/misc";
import { StatusIndicator } from "@dashboard/orders/components/OrderCardTitle/StatusIndicator";
import { TrackingNumberDisplay } from "@dashboard/orders/components/OrderCardTitle/TrackingNumberDisplay";
import { WarehouseInfo } from "@dashboard/orders/components/OrderCardTitle/WarehouseInfo";
import { ActionButtons } from "@dashboard/orders/components/OrderFulfillmentCard/ActionButtons";
import { ReasonDisplay } from "@dashboard/orders/components/ReasonDisplay/ReasonDisplay";
import {
  type LineShipmentEntry,
  type OrderLineLifecycle,
} from "@dashboard/orders/utils/buildOrderLineLifecycle";
import { getOrderLineDisplayName } from "@dashboard/orders/utils/data";
import { getOrderRefundNavigation } from "@dashboard/orders/utils/getOrderRefundNavigation";
import { Box, Button, Dropdown, List, Text } from "@saleor/macaw-ui-next";
import { Code, EllipsisVertical } from "lucide-react";
import { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import styles from "./OrderLineExpandedPanel.module.css";
import { OrderLineGrantedRefundRow } from "./OrderLineGrantedRefundRow";

const cancelableStatuses = [FulfillmentStatus.FULFILLED, FulfillmentStatus.WAITING_FOR_APPROVAL];

const MetadataDot = (): JSX.Element => (
  <span className={styles.metadataDot} aria-hidden="true">
    ·
  </span>
);

const getShipmentReasonDisplay = (
  fulfillment: NonNullable<OrderDetailsFragment["fulfillments"]>[number],
  orderLineId: string,
): { reason?: string | null; reasonReference?: string | null } => {
  const fulfillmentLine = fulfillment.lines?.find(line => line.orderLine?.id === orderLineId);

  return {
    reason: fulfillmentLine?.reason ?? fulfillment.reason,
    reasonReference: fulfillmentLine?.reasonReference?.title ?? fulfillment.reasonReference?.title,
  };
};

interface OrderLineExpandedPanelProps {
  lifecycle: OrderLineLifecycle;
  order: OrderDetailsFragment;
  fulfillmentAllowUnpaid: boolean;
  panelId?: string;
  onOrderFulfillmentApprove: (fulfillmentId: string) => void;
  onOrderFulfillmentCancel: (fulfillmentId: string) => void;
  onTrackingCodeAdd: (fulfillmentId: string) => void;
  onFulfillmentShowMetadata: (fulfillmentId: string) => void;
  showCanceledShipments: boolean;
  onShowCanceledShipmentsChange: (value: boolean) => void;
}

export const OrderLineExpandedPanel = ({
  lifecycle,
  order,
  fulfillmentAllowUnpaid,
  panelId,
  onOrderFulfillmentApprove,
  onOrderFulfillmentCancel,
  onTrackingCodeAdd,
  onFulfillmentShowMetadata,
  showCanceledShipments,
  onShowCanceledShipmentsChange,
}: OrderLineExpandedPanelProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { locale } = useLocale();
  const refundNavigation = getOrderRefundNavigation(order, { lineId: lifecycle.orderLineId });
  const line = lifecycle.orderLine;
  const shipments = lifecycle.shipments;
  const grantedRefundEntries = lifecycle.grantedRefundEntries;
  const { activeShipments, canceledShipments } = useMemo(() => {
    const active: LineShipmentEntry[] = [];
    const canceled: LineShipmentEntry[] = [];

    shipments.forEach(shipment => {
      if (shipment.status === FulfillmentStatus.CANCELED) {
        canceled.push(shipment);
      } else {
        active.push(shipment);
      }
    });

    return { activeShipments: active, canceledShipments: canceled };
  }, [shipments]);
  const visibleShipments = showCanceledShipments
    ? [...activeShipments, ...canceledShipments]
    : activeShipments;
  const hasShipments = shipments.length > 0;
  const hasGrantedRefunds = grantedRefundEntries.length > 0;
  const productName = getOrderLineDisplayName({
    productName: line.productName,
    variant: line.variant,
  });

  return (
    <Box
      id={panelId}
      role="region"
      marginTop={0}
      padding={6}
      borderWidth={1}
      borderStyle="solid"
      borderColor="default1"
      borderRadius={4}
      backgroundColor="default2"
      data-test-id="order-line-expanded-panel"
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={1}
        marginBottom={hasShipments || hasGrantedRefunds ? 4 : 0}
      >
        <Text size={5} fontWeight="medium" display="block">
          <FormattedMessage {...messages.panelTitle} values={{ productName }} />
        </Text>

        {!hasShipments && !hasGrantedRefunds && (
          <Text size={3} color="default2" display="block">
            <FormattedMessage {...messages.noActivity} />
          </Text>
        )}
      </Box>

      {hasShipments && (
        <Box display="flex" flexDirection="column" gap={4} marginBottom={hasGrantedRefunds ? 6 : 0}>
          <Text size={4} fontWeight="medium" display="block">
            <FormattedMessage {...messages.shipmentsSection} />
          </Text>
          {visibleShipments.map(shipment => {
            const fulfillment = order.fulfillments?.find(getById(shipment.fulfillmentId));

            if (!fulfillment) {
              return null;
            }

            const isCanceled = shipment.status === FulfillmentStatus.CANCELED;
            const sourceWarehouseVariant = isCanceled ? "shippedFrom" : "fulfilledFrom";
            const { reason, reasonReference } = getShipmentReasonDisplay(
              fulfillment,
              lifecycle.orderLineId,
            );

            const showCancelMenu = cancelableStatuses.includes(fulfillment.status);

            return (
              <Box
                key={shipment.fulfillmentId}
                display="grid"
                __gridTemplateColumns="1fr auto"
                alignItems="center"
                gap={4}
                padding={4}
                borderWidth={1}
                borderStyle="solid"
                borderColor="default1"
                borderRadius={3}
                backgroundColor="default1"
                data-test-id="order-line-shipment-row"
              >
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box className={styles.summaryRow}>
                    <Text size={4} fontWeight="medium">
                      {shipment.displayId}
                    </Text>
                    <StatusIndicator showLabel status={shipment.status} />
                    <MetadataDot />
                    <Text size={3} color="default2">
                      <FormattedMessage
                        {...messages.quantity}
                        values={{ quantity: shipment.quantity }}
                      />
                    </Text>
                  </Box>
                  <Box className={styles.metadataRow}>
                    <Text color="default2" size={2} as="span">
                      <FormatDate date={shipment.created} />
                    </Text>
                    {shipment.warehouse && (
                      <>
                        <MetadataDot />
                        <WarehouseInfo
                          warehouseName={shipment.warehouse.name}
                          warehouseId={shipment.warehouse.id}
                          separator=""
                          variant={sourceWarehouseVariant}
                        />
                      </>
                    )}
                    {shipment.restockWarehouse && (
                      <>
                        <MetadataDot />
                        <WarehouseInfo
                          warehouseName={shipment.restockWarehouse.name}
                          warehouseId={shipment.restockWarehouse.id}
                          separator=""
                          variant="restockedTo"
                        />
                      </>
                    )}
                    {shipment.trackingNumber && (
                      <>
                        <MetadataDot />
                        <TrackingNumberDisplay
                          trackingNumber={shipment.trackingNumber}
                          separator=""
                        />
                      </>
                    )}
                    {(fulfillment.totalRefundedAmount?.amount ?? 0) > 0 && (
                      <>
                        <MetadataDot />
                        <Text color="default2" size={2} as="span">
                          <FormattedMessage
                            {...messages.refundedAmount}
                            values={{
                              amount: formatMoneyAmount(fulfillment.totalRefundedAmount, locale),
                            }}
                          />
                        </Text>
                      </>
                    )}
                  </Box>
                  {(reason || reasonReference) && (
                    <ReasonDisplay reasonReference={reasonReference} reason={reason} />
                  )}
                </Box>
                <Box className={styles.shipmentActions}>
                  <Button
                    variant="secondary"
                    onClick={() => onFulfillmentShowMetadata(fulfillment.id)}
                    data-test-id="show-fulfillment-metadata"
                    icon={<Code size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
                    title={intl.formatMessage(messages.fulfillmentMetadata)}
                  />
                  <ActionButtons
                    status={fulfillment.status}
                    trackingNumber={fulfillment.trackingNumber}
                    orderIsPaid={order.isPaid}
                    fulfillmentAllowUnpaid={fulfillmentAllowUnpaid}
                    onTrackingCodeAdd={() => onTrackingCodeAdd(fulfillment.id)}
                    onApprove={() => onOrderFulfillmentApprove(fulfillment.id)}
                    onRefund={
                      refundNavigation.canRefund ? () => navigate(refundNavigation.url) : undefined
                    }
                  />
                  {showCancelMenu ? (
                    <Dropdown>
                      <Dropdown.Trigger>
                        <Button
                          variant="tertiary"
                          icon={
                            <EllipsisVertical
                              size={iconSize.small}
                              strokeWidth={iconStrokeWidthBySize.small}
                            />
                          }
                          data-test-id="shipment-menu-button"
                          title={intl.formatMessage(buttonMessages.moreOptions)}
                        />
                      </Dropdown.Trigger>
                      <Dropdown.Content align="end">
                        <List
                          padding={2}
                          borderRadius={4}
                          boxShadow="defaultOverlay"
                          backgroundColor="default1"
                        >
                          <Dropdown.Item>
                            <List.Item
                              borderRadius={4}
                              paddingX={1.5}
                              paddingY={2}
                              onClick={() => onOrderFulfillmentCancel(fulfillment.id)}
                              data-test-id="cancel-fulfillment"
                            >
                              <Text color="critical1">
                                <FormattedMessage {...messages.cancelFulfillment} />
                              </Text>
                            </List.Item>
                          </Dropdown.Item>
                        </List>
                      </Dropdown.Content>
                    </Dropdown>
                  ) : (
                    <Box aria-hidden className={styles.shipmentMenuPlaceholder} />
                  )}
                </Box>
              </Box>
            );
          })}
          {canceledShipments.length > 0 && (
            <Button
              variant="tertiary"
              onClick={() => onShowCanceledShipmentsChange(!showCanceledShipments)}
              data-test-id="toggle-canceled-line-shipments"
            >
              <FormattedMessage
                {...(showCanceledShipments
                  ? messages.hideCanceledShipments
                  : messages.showCanceledShipments)}
                values={{ count: canceledShipments.length }}
              />
            </Button>
          )}
        </Box>
      )}

      {hasGrantedRefunds && (
        <Box display="flex" flexDirection="column" gap={4}>
          <Text size={4} fontWeight="medium" display="block">
            <FormattedMessage {...messages.transactionRefundsSection} />
          </Text>
          {grantedRefundEntries.map(entry => (
            <OrderLineGrantedRefundRow
              key={entry.grantedRefundId}
              entry={entry}
              orderId={order.id}
              locale={locale}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
