// @ts-strict-ignore
import { FormatDate } from "@dashboard/components/Date/FormatDate";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { formatMoneyAmount } from "@dashboard/components/Money";
import { FulfillmentStatus, type OrderDetailsFragment } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { buttonMessages } from "@dashboard/intl";
import { getById } from "@dashboard/misc";
import { StatusIndicator } from "@dashboard/orders/components/OrderCardTitle/StatusIndicator";
import { TrackingNumberDisplay } from "@dashboard/orders/components/OrderCardTitle/TrackingNumberDisplay";
import { WarehouseInfo } from "@dashboard/orders/components/OrderCardTitle/WarehouseInfo";
import { ActionButtons } from "@dashboard/orders/components/OrderFulfillmentCard/ActionButtons";
import { type OrderLineLifecycle } from "@dashboard/orders/utils/buildOrderLineLifecycle";
import { Box, Button, Dropdown, List, Text } from "@saleor/macaw-ui-next";
import { EllipsisVertical } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import styles from "./OrderLineExpandedPanel.module.css";

const cancelableStatuses = [FulfillmentStatus.FULFILLED, FulfillmentStatus.WAITING_FOR_APPROVAL];

const MetadataDot = (): JSX.Element => (
  <span className={styles.metadataDot} aria-hidden="true">
    ·
  </span>
);

interface OrderLineExpandedPanelProps {
  lifecycle: OrderLineLifecycle;
  order: OrderDetailsFragment;
  fulfillmentAllowUnpaid: boolean;
  panelId?: string;
  onOrderFulfillmentApprove: (fulfillmentId: string) => void;
  onOrderFulfillmentCancel: (fulfillmentId: string) => void;
  onTrackingCodeAdd: (fulfillmentId: string) => void;
}

export const OrderLineExpandedPanel = ({
  lifecycle,
  order,
  fulfillmentAllowUnpaid,
  panelId,
  onOrderFulfillmentApprove,
  onOrderFulfillmentCancel,
  onTrackingCodeAdd,
}: OrderLineExpandedPanelProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const line = lifecycle.orderLine;
  const shipments = lifecycle.shipments;

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
        marginBottom={shipments.length > 0 ? 4 : 0}
      >
        <Text size={5} fontWeight="medium" display="block">
          <FormattedMessage
            {...messages.panelTitle}
            values={{
              productName: [line.productName, line.variant?.name].filter(Boolean).join(" / "),
            }}
          />
        </Text>

        {lifecycle.grantedRefund > 0 && (
          <Text size={3} color="default2" display="block">
            <FormattedMessage
              {...messages.grantedRefund}
              values={{ quantity: lifecycle.grantedRefund }}
            />
          </Text>
        )}

        {shipments.length === 0 && (
          <Text size={3} color="default2" display="block">
            <FormattedMessage {...messages.noShipments} />
          </Text>
        )}
      </Box>

      {shipments.length > 0 && (
        <Box display="flex" flexDirection="column" gap={4}>
          {shipments.map(shipment => {
            const fulfillment = order.fulfillments?.find(getById(shipment.fulfillmentId));

            if (!fulfillment) {
              return null;
            }

            const isCanceled = shipment.status === FulfillmentStatus.CANCELED;
            const sourceWarehouseVariant = isCanceled ? "shippedFrom" : "fulfilledFrom";

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
                    <StatusIndicator status={shipment.status} />
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
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <ActionButtons
                    orderId={order.id}
                    status={fulfillment.status}
                    trackingNumber={fulfillment.trackingNumber}
                    orderIsPaid={order.isPaid}
                    fulfillmentAllowUnpaid={fulfillmentAllowUnpaid}
                    hasTransactions={Boolean(order.transactions?.length)}
                    onTrackingCodeAdd={() => onTrackingCodeAdd(fulfillment.id)}
                    onApprove={() => onOrderFulfillmentApprove(fulfillment.id)}
                  />
                  {cancelableStatuses.includes(fulfillment.status) && (
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
                              <Text>
                                <FormattedMessage {...messages.cancelFulfillment} />
                              </Text>
                            </List.Item>
                          </Dropdown.Item>
                        </List>
                      </Dropdown.Content>
                    </Dropdown>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
