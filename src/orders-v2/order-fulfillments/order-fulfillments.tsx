import { FulfillmentFragment } from "@dashboard/graphql";
import { OrderDetailsDatagrid } from "@dashboard/orders/components/OrderDetailsDatagrid";
import { warehouseUrl } from "@dashboard/warehouses/urls";
import { Box, Button, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { CodeXml } from "lucide-react";
import { IntlShape, useIntl } from "react-intl";

import { OrderDetailsViewModel } from "../order-details-view-model";
import { UnderlineLink } from "../underline-link";
import { OrderFulfillmentTrackingNumberButton } from "./order-fulfillment-change-tracking-number";
import { OrderFulfillmentStatusIcon } from "./order-fulfillment-status-icon";
import { OrderFulfillmentTrackingNumber } from "./order-fulfillment-tracking-number";

type Props = PropsWithBox<{
  fulfillments: FulfillmentFragment[];
}>;

const getFulfillmentStatusLabel = (status: string, intl: IntlShape): string => {
  switch (status) {
    case "CANCELED":
      return intl.formatMessage({
        defaultMessage: "Canceled",
        id: "PFtMy9",
      });
    case "FULFILLED":
      return intl.formatMessage({
        defaultMessage: "Fulfilled",
        id: "jY+f2f",
      });
    case "REFUNDED":
      return intl.formatMessage({
        defaultMessage: "Refunded",
        id: "Gs86nL",
      });
    case "REFUNDED_AND_RETURNED":
      return intl.formatMessage({
        defaultMessage: "Refunded and Returned",
        id: "J7ejFT",
      });
    case "REPLACED":
      return intl.formatMessage({
        defaultMessage: "Replaced",
        id: "BWjfHd",
      });
    case "RETURNED":
      return intl.formatMessage({
        defaultMessage: "Returned",
        id: "wm96Jx",
      });
    case "WAITING_FOR_APPROVAL":
      return intl.formatMessage({
        defaultMessage: "Waiting for Approval",
        id: "dJa3Dt",
      });
    default:
      return intl.formatMessage({
        defaultMessage: "Other",
        id: "/VnDMl",
      });
  }
};

export const OrderFulfillments = ({ fulfillments, ...props }: Props) => {
  const intl = useIntl();

  return (
    <Box {...props}>
      <Box paddingX={6} paddingY={5}>
        <Text color="default2" size={3}>
          {intl.formatMessage(
            {
              defaultMessage:
                "{count, plural, one {# fulfillment group} other {# fulfillment groups}}",
              id: "mxLMrd",
            },
            { count: fulfillments.length },
          )}
        </Text>
      </Box>
      {fulfillments.map(fulfillment => (
        <Box
          key={`fulfillment-${fulfillment.id}`}
          borderColor="default1"
          borderStyle="solid"
          borderWidth={1}
          borderLeftWidth={0}
          borderRightWidth={0}
          borderBottomWidth={0}
          marginBottom={5}
        >
          <Box padding={6} display="flex" justifyContent="space-between" backgroundColor="default2">
            <Box>
              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                {fulfillment.warehouse?.id && fulfillment.warehouse?.name && (
                  <Text color="default2" size={2}>
                    {intl.formatMessage(
                      {
                        defaultMessage: "From {warehouseName}: {fulfillmentCreationDate}",
                        id: "yg0ELD",
                      },
                      {
                        warehouseName: (
                          <UnderlineLink to={warehouseUrl(fulfillment.warehouse.id)}>
                            {fulfillment.warehouse.name}
                          </UnderlineLink>
                        ),
                        fulfillmentCreationDate: intl.formatDate(fulfillment.created, {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                      },
                    )}
                  </Text>
                )}
                {fulfillment.trackingNumber && (
                  <OrderFulfillmentTrackingNumber trackingNumber={fulfillment.trackingNumber} />
                )}
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Text size={6} fontWeight="medium">
                  {getFulfillmentStatusLabel(fulfillment.status, intl)}
                </Text>
                <OrderFulfillmentStatusIcon status={fulfillment.status} />
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Button icon={<CodeXml size={17} />} variant="secondary" />

              {OrderDetailsViewModel.shouldShowFulfillmentTrackingNumberButton(
                fulfillment.status,
              ) && <OrderFulfillmentTrackingNumberButton fulfillment={fulfillment} />}
            </Box>
          </Box>

          <OrderDetailsDatagrid
            lines={
              fulfillment.lines?.map(line => line.orderLine).filter(line => line !== null) ?? []
            }
            loading={false}
            onShowMetadata={() => {
              alert("Metadata show");
            }}
            enableVerticalBorder={false}
          />
        </Box>
      ))}
    </Box>
  );
};
