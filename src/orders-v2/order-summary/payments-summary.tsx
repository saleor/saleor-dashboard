import { OrderDetailsFragment, PaymentChargeStatusEnum } from "@dashboard/graphql";
import { PillStatusType } from "@dashboard/misc";
import { Box, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";
import { IntlShape, useIntl } from "react-intl";

import { OrderDetailsViewModel } from "../order-details-view-model";
import { StatusPill } from "../status-pill";
import { assertUnreachable } from "../utils/assert-unreachable";
import { OrderSummaryListItem } from "./order-summary-list-item";

const getPaymentStatusPillData = (
  status: PaymentChargeStatusEnum,
  intl: IntlShape,
): {
  status: PillStatusType;
  label: ReactNode;
} => {
  switch (status) {
    case PaymentChargeStatusEnum.FULLY_CHARGED: {
      return {
        status: "success",
        label: intl.formatMessage({
          defaultMessage: "Fully paid",
          id: "JZKsZF",
        }),
      };
    }
    case PaymentChargeStatusEnum.NOT_CHARGED: {
      return {
        status: "info",
        label: intl.formatMessage({
          defaultMessage: "Not charged",
          id: "n74igO",
        }),
      };
    }
    case PaymentChargeStatusEnum.PARTIALLY_CHARGED: {
      return {
        status: "warning",
        label: intl.formatMessage({
          defaultMessage: "Partially charged",
          id: "ChDAaD",
        }),
      };
    }
    case PaymentChargeStatusEnum.FULLY_REFUNDED: {
      return {
        status: "success",
        label: intl.formatMessage({
          defaultMessage: "Fully refunded",
          id: "VcQV4Z",
        }),
      };
    }
    case PaymentChargeStatusEnum.PARTIALLY_REFUNDED: {
      return {
        status: "warning",
        label: intl.formatMessage({
          defaultMessage: "Partially refunded",
          id: "XvZCaw",
        }),
      };
    }
    case PaymentChargeStatusEnum.CANCELLED: {
      return {
        status: "warning",
        label: intl.formatMessage({
          defaultMessage: "Cancelled",
          id: "3wsVWF",
        }),
      };
    }
    case PaymentChargeStatusEnum.PENDING: {
      return {
        status: "info",
        label: intl.formatMessage({
          defaultMessage: "Pending",
          id: "eKEL/g",
        }),
      };
    }
    case PaymentChargeStatusEnum.REFUSED: {
      return {
        status: "error",
        label: intl.formatMessage({
          defaultMessage: "Refused",
          id: "NT+3fY",
        }),
      };
    }
    default: {
      return assertUnreachable(
        status,
        new Error("getPaymentStatusPillData: Unsupported payment status", {
          cause: status,
        }),
      );
    }
  }
};

type Props = PropsWithBox<{
  orderAmounts: {
    totalAuthorized: OrderDetailsFragment["totalAuthorized"];
    totalCaptured: OrderDetailsFragment["totalCaptured"];
    totalRefunded: OrderDetailsFragment["totalRefunded"];
    totalBalance: OrderDetailsFragment["totalBalance"];
    total: OrderDetailsFragment["total"];
    totalAuthorizePending: OrderDetailsFragment["totalAuthorizePending"];
    totalCharged: OrderDetailsFragment["totalCharged"];
    totalChargePending: OrderDetailsFragment["totalChargePending"];
    totalCanceled: OrderDetailsFragment["totalCanceled"];
    totalCancelPending: OrderDetailsFragment["totalCancelPending"];
  };
  paymentStatus: PaymentChargeStatusEnum;
}>;

export const PaymentsSummary = ({ orderAmounts, paymentStatus, ...props }: Props) => {
  const intl = useIntl();

  const { status, label } = getPaymentStatusPillData(paymentStatus, intl);

  const shouldDisplay = OrderDetailsViewModel.getShouldDisplayAmounts(orderAmounts);

  return (
    <Box
      backgroundColor="default2"
      padding={5}
      borderRadius={4}
      borderStyle="solid"
      borderColor="default1"
      {...props}
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box display="flex" flexDirection="column">
          <Text fontWeight="medium" fontSize={6}>
            {intl.formatMessage({
              defaultMessage: "Payments summary",
              id: "q7bXR4",
            })}
          </Text>
          <Text color="default2" size={3}>
            {intl.formatMessage({
              defaultMessage: "All payments from registered transactions.",
              id: "9TENcY",
            })}
          </Text>
        </Box>
        <StatusPill status={status}>{label}</StatusPill>
      </Box>

      <Box as="ul" display="grid" gap={1} marginTop={4}>
        <OrderSummaryListItem amount={orderAmounts.totalAuthorized.amount}>
          {intl.formatMessage({
            defaultMessage: "Authorized",
            id: "NAepnj",
          })}
        </OrderSummaryListItem>
        {shouldDisplay.authorizedPending && (
          <OrderSummaryListItem amount={orderAmounts.totalAuthorizePending.amount}>
            {intl.formatMessage({
              defaultMessage: "Authorized pending",
              id: "tXOS3M",
            })}
          </OrderSummaryListItem>
        )}
        <OrderSummaryListItem amount={orderAmounts.totalCaptured.amount} showSign>
          {intl.formatMessage({
            defaultMessage: "Captured",
            id: "nMwGMj",
          })}
        </OrderSummaryListItem>
        {shouldDisplay.chargedPending && (
          <OrderSummaryListItem amount={orderAmounts.totalChargePending.amount}>
            {intl.formatMessage({
              defaultMessage: "Charged pending",
              id: "Aw2OKG",
            })}
          </OrderSummaryListItem>
        )}
        <OrderSummaryListItem amount={orderAmounts.totalCanceled.amount}>
          {intl.formatMessage({
            defaultMessage: "Cancelled",
            id: "3wsVWF",
          })}
        </OrderSummaryListItem>
        {shouldDisplay.cancelledPending && (
          <OrderSummaryListItem amount={orderAmounts.totalCancelPending.amount}>
            {intl.formatMessage({
              defaultMessage: "Cancelled pending",
              id: "o0AP7/",
            })}
          </OrderSummaryListItem>
        )}
        <OrderSummaryListItem amount={-orderAmounts.totalRefunded.amount} showSign>
          {intl.formatMessage({
            defaultMessage: "Refunded",
            id: "Gs86nL",
          })}
        </OrderSummaryListItem>
      </Box>
    </Box>
  );
};
