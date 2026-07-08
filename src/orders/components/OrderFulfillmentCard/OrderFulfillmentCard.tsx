// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { iconSize, iconStrokeWidth, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { FulfillmentStatus, type OrderDetailsFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { orderHasTransactions } from "@dashboard/orders/types";
import { mergeRepeatedOrderLines } from "@dashboard/orders/utils/data";
import { Box, Button, Dropdown, List, Text, useTheme } from "@saleor/macaw-ui-next";
import { Code, EllipsisVertical } from "lucide-react";
import { useIntl } from "react-intl";

import { OrderCardDatagridSeparator } from "../OrderCardTitle/OrderCardDatagridSeparator";
import { OrderCardTitle } from "../OrderCardTitle/OrderCardTitle";
import { OrderDetailsDatagrid } from "../OrderDetailsDatagrid/OrderDetailsDatagrid";
import { OrderLineGroupEnd } from "../OrderLineGroupBottomSeparator/OrderLineGroupBottomSeparator";
import { ReasonDisplay } from "../ReasonDisplay/ReasonDisplay";
import { ActionButtons } from "./ActionButtons";

interface OrderFulfillmentCardProps {
  fulfillment: OrderDetailsFragment["fulfillments"][0];
  fulfillmentAllowUnpaid: boolean;
  order?: OrderDetailsFragment;
  onOrderFulfillmentApprove: () => void;
  onOrderFulfillmentCancel: () => void;
  onTrackingCodeAdd: () => void;
  dataTestId?: string;
  onOrderLineShowMetadata: (id: string) => void;
  onShowLinePriceBreakdown?: (lineId: string) => void;
  onFulfillmentShowMetadata?: () => void;
  showBottomSeparator?: boolean;
}

const statusesToMergeLines = [
  FulfillmentStatus.REFUNDED,
  FulfillmentStatus.REFUNDED_AND_RETURNED,
  FulfillmentStatus.RETURNED,
  FulfillmentStatus.REPLACED,
];
const cancelableStatuses = [FulfillmentStatus.FULFILLED, FulfillmentStatus.WAITING_FOR_APPROVAL];
const fulfillmentLineToLine = ({
  quantity,
  orderLine,
}: OrderDetailsFragment["fulfillments"][0]["lines"][0]) => ({
  ...orderLine,
  // 'quantity' has the correct number of returned items
  // 'orderLine.quantity' has the total number of items in the order
  quantity,
});

export const OrderFulfillmentCard = (props: OrderFulfillmentCardProps) => {
  const {
    fulfillment,
    fulfillmentAllowUnpaid,
    order,
    onOrderFulfillmentApprove,
    onOrderFulfillmentCancel,
    onTrackingCodeAdd,
    onOrderLineShowMetadata,
    onShowLinePriceBreakdown,
    onFulfillmentShowMetadata,
    dataTestId,
    showBottomSeparator = false,
  } = props;
  const intl = useIntl();
  const { themeValues } = useTheme();

  if (!fulfillment) {
    return null;
  }

  const getFulfillmentLines = () =>
    statusesToMergeLines.includes(fulfillment?.status)
      ? mergeRepeatedOrderLines(fulfillment.lines)
      : (fulfillment?.lines ?? []);
  const lines = getFulfillmentLines().map(fulfillmentLineToLine);
  const hasLines = lines.length > 0;
  const lineReasons = getFulfillmentLines().map(line => ({
    reason: line.reason ?? null,
    reasonType: line.reasonReference?.title ?? null,
  }));
  const hasLineReasons = lineReasons.some(({ reason, reasonType }) => reason || reasonType);

  return (
    <Box data-test-id={dataTestId} backgroundColor="default2">
      <OrderCardTitle
        withStatus
        status={fulfillment?.status}
        warehouseName={fulfillment?.warehouse?.name}
        backgroundColor={"default2"}
        createdDate={fulfillment?.created}
        trackingNumber={fulfillment.trackingNumber}
        warehouseId={fulfillment?.warehouse?.id}
        hasToolbarMenu={cancelableStatuses.includes(fulfillment?.status)}
        toolbar={
          <Box display="flex" alignItems="center" gap={3}>
            {onFulfillmentShowMetadata && (
              <Button
                variant="secondary"
                onClick={onFulfillmentShowMetadata}
                data-test-id="show-fulfillment-metadata"
                icon={<Code size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
                title="Edit fulfillment group metadata"
              />
            )}
            <ActionButtons
              orderId={order?.id}
              status={fulfillment?.status}
              trackingNumber={fulfillment?.trackingNumber}
              orderIsPaid={order?.isPaid}
              fulfillmentAllowUnpaid={fulfillmentAllowUnpaid}
              onTrackingCodeAdd={onTrackingCodeAdd}
              onApprove={onOrderFulfillmentApprove}
              hasTransactions={orderHasTransactions(order)}
            />
            {cancelableStatuses.includes(fulfillment?.status) && (
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
                    data-test-id="fulfillment-menu-button"
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
                        onClick={onOrderFulfillmentCancel}
                        data-test-id="cancel-fulfillment"
                      >
                        <Text>Cancel fulfillment</Text>
                      </List.Item>
                    </Dropdown.Item>
                  </List>
                </Dropdown.Content>
              </Dropdown>
            )}
          </Box>
        }
      />
      {(fulfillment.reason || fulfillment.reasonReference) && (
        <Box __paddingLeft="3.2rem" paddingTop={0} paddingBottom={4} backgroundColor="default2">
          <ReasonDisplay
            reasonReference={fulfillment.reasonReference?.title}
            reason={fulfillment.reason}
          />
        </Box>
      )}
      {hasLines && (
        <>
          <OrderCardDatagridSeparator />
          <DashboardCard.Content paddingX={0}>
            <OrderDetailsDatagrid
              lines={lines}
              lineReasons={hasLineReasons ? lineReasons : undefined}
              loading={false}
              onOrderLineShowMetadata={onOrderLineShowMetadata}
              onShowLinePriceBreakdown={onShowLinePriceBreakdown}
              columnPickerBackgroundColor="default2"
              datagridCustomTheme={{
                bgHeader: themeValues.colors.background.default2,
              }}
            />
            <OrderLineGroupEnd
              showBottomSeparator={showBottomSeparator}
              backgroundColor="default2"
            />
          </DashboardCard.Content>
        </>
      )}
    </Box>
  );
};
