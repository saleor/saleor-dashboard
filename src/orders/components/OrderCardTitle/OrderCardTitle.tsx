import { Typography } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import DefaultCardTitle from "@saleor/components/CardTitle";
import { FulfillmentStatus } from "@saleor/graphql";
import { CircleIndicator, makeStyles } from "@saleor/macaw-ui";
import { StatusType } from "@saleor/types";
import camelCase from "lodash/camelCase";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    title: {
      width: "100%",
      display: "flex",
      justifyContent: "flex-start",
    },
    orderNumber: {
      display: "inline",
      marginLeft: theme.spacing(1),
    },
    warehouseName: {
      float: "right",
      alignSelf: "center",
      color: theme.palette.text.secondary,
      margin: `auto ${theme.spacing(1)} auto auto`,
    },
    cardHeader: {
      fontSize: "24px",
      fontWeight: 500,
      lineHeight: "29px",
      letterSpacing: "0.02em",
      textAlign: "left",
    },
    indicator: {
      display: "flex",
      alignItems: "center",
    },
  }),
  { name: "OrderCardTitle" },
);

const messages = defineMessages({
  canceled: {
    defaultMessage: "Canceled ({quantity})",
    id: "mGcw06",
    description: "canceled fulfillment, section header",
  },
  fulfilled: {
    id: "iJrw63",
    defaultMessage: "Fulfilled ({quantity})",
    description: "section header",
  },
  refunded: {
    id: "oQhFlK",
    defaultMessage: "Refunded ({quantity})",
    description: "refunded fulfillment, section header",
  },
  refundedAndReturned: {
    id: "jNSOSu",
    defaultMessage: "Refunded and Returned ({quantity})",
    description: "cancelled fulfillment, section header",
  },
  replaced: {
    id: "3stu21",
    defaultMessage: "Replaced ({quantity})",
    description: "refunded fulfillment, section header",
  },
  returned: {
    id: "eCRaHe",
    defaultMessage: "Returned ({quantity})",
    description: "refunded fulfillment, section header",
  },
  waitingForApproval: {
    id: "9ssWj+",
    defaultMessage: "Waiting for approval ({quantity})",
    description: "unapproved fulfillment, section header",
  },
  unfulfilled: {
    defaultMessage: "Unfulfilled ({quantity})",
    id: "Kc2/e7",
    description: "section header",
  },
  fulfilledFrom: {
    id: "ZPOyI1",
    defaultMessage: "Fulfilled from {warehouseName}",
    description: "fulfilled fulfillment, section header",
  },
});

type CardTitleStatus = FulfillmentStatus | "unfulfilled";

type CardTitleLines = Array<{
  quantity: number;
  quantityToFulfill?: number;
}>;

interface OrderCardTitleProps {
  lines?: CardTitleLines;
  fulfillmentOrder?: number;
  status: CardTitleStatus;
  toolbar?: React.ReactNode;
  orderNumber?: string;
  warehouseName?: string;
  withStatus?: boolean;
  className?: string;
}

const selectStatus = (status: CardTitleStatus) => {
  switch (status) {
    case FulfillmentStatus.FULFILLED:
      return StatusType.SUCCESS;
    case FulfillmentStatus.REFUNDED:
      return StatusType.INFO;
    case FulfillmentStatus.RETURNED:
      return StatusType.INFO;
    case FulfillmentStatus.REPLACED:
      return StatusType.INFO;
    case FulfillmentStatus.REFUNDED_AND_RETURNED:
      return StatusType.INFO;
    case FulfillmentStatus.WAITING_FOR_APPROVAL:
      return StatusType.WARNING;
    case FulfillmentStatus.CANCELED:
      return StatusType.ERROR;
    default:
      return StatusType.ERROR;
  }
};

const OrderCardTitle: React.FC<OrderCardTitleProps> = ({
  lines = [],
  fulfillmentOrder,
  status,
  orderNumber = "",
  warehouseName,
  withStatus = false,
  toolbar,
  className,
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const fulfillmentName =
    orderNumber && fulfillmentOrder
      ? `#${orderNumber}-${fulfillmentOrder}`
      : "";

  const messageForStatus = messages[camelCase(status)] || messages.unfulfilled;

  const totalQuantity =
    status === "unfulfilled"
      ? lines.reduce(
          (resultQuantity, line) =>
            resultQuantity + (line.quantityToFulfill ?? line.quantity),
          0,
        )
      : lines.reduce(
          (resultQuantity, { quantity }) => resultQuantity + quantity,
          0,
        );

  return (
    <DefaultCardTitle
      toolbar={toolbar}
      className={className}
      title={
        <div className={classes.title}>
          {withStatus && (
            <div className={classes.indicator}>
              <CircleIndicator color={selectStatus(status)} />
            </div>
          )}
          <HorizontalSpacer spacing={2} />
          <Typography className={classes.cardHeader}>
            {intl.formatMessage(messageForStatus, {
              fulfillmentName,
              quantity: totalQuantity,
            })}
          </Typography>
          {!!warehouseName && (
            <Typography className={classes.warehouseName} variant="caption">
              <FormattedMessage
                {...messages.fulfilledFrom}
                values={{
                  warehouseName,
                }}
              />
            </Typography>
          )}
        </div>
      }
    />
  );
};

OrderCardTitle.displayName = "OrderCardTitle";
export default OrderCardTitle;
