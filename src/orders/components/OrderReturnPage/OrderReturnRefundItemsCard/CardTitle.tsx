import { Typography } from "@material-ui/core";
import DefaultCardTitle from "@saleor/components/CardTitle";
import { StatusType } from "@saleor/components/StatusChip/types";
import StatusLabel from "@saleor/components/StatusLabel";
import { makeStyles } from "@saleor/theme";
import { FulfillmentStatus } from "@saleor/types/globalTypes";
import camelCase from "lodash/camelCase";
import React from "react";
import { defineMessages } from "react-intl";
import { useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    orderNumber: {
      display: "inline",
      marginLeft: theme.spacing(1)
    }
  }),
  { name: "CardTitle" }
);

const messages = defineMessages({
  cancelled: {
    defaultMessage: "Cancelled ({quantity})",
    description: "cancelled fulfillment, section header"
  },
  fulfilled: {
    defaultMessage: "Fulfilled ({quantity})",
    description: "section header"
  },
  refunded: {
    defaultMessage: "Refunded ({quantity})",
    description: "refunded fulfillment, section header"
  },
  refundedAndReturned: {
    defaultMessage: "Refunded and Returned ({quantity})",
    description: "cancelled fulfillment, section header"
  },
  replaced: {
    defaultMessage: "Replaced ({quantity})",
    description: "refunded fulfillment, section header"
  },
  returned: {
    defaultMessage: "Returned ({quantity})",
    description: "refunded fulfillment, section header"
  },
  unfulfilled: {
    defaultMessage: "Unfulfilled",
    description: "section header"
  }
});

type CardTitleStatus = FulfillmentStatus | "unfulfilled";

type CardTitleLines = Array<{
  quantity: number;
}>;

interface CardTitleProps {
  lines?: CardTitleLines;
  fulfillmentOrder?: number;
  status: CardTitleStatus;
  toolbar?: React.ReactNode;
  orderNumber?: string;
  withStatus?: boolean;
}

const selectStatus = (status: CardTitleStatus) => {
  switch (status) {
    case FulfillmentStatus.FULFILLED:
      return StatusType.SUCCESS;
    case FulfillmentStatus.REFUNDED:
      return StatusType.NEUTRAL;
    case FulfillmentStatus.RETURNED:
      return StatusType.NEUTRAL;
    case FulfillmentStatus.REPLACED:
      return StatusType.NEUTRAL;
    case FulfillmentStatus.REFUNDED_AND_RETURNED:
      return StatusType.NEUTRAL;
    case FulfillmentStatus.CANCELED:
      return StatusType.ERROR;
    default:
      return StatusType.ALERT;
  }
};

const CardTitle: React.FC<CardTitleProps> = ({
  lines = [],
  fulfillmentOrder,
  status,
  orderNumber = "",
  withStatus = false,
  toolbar
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const fulfillmentName =
    orderNumber && fulfillmentOrder
      ? `#${orderNumber}-${fulfillmentOrder}`
      : "";

  const messageForStatus = messages[camelCase(status)] || messages.unfulfilled;

  const totalQuantity = lines.reduce(
    (resultQuantity, { quantity }) => resultQuantity + quantity,
    0
  );

  const title = (
    <>
      {intl.formatMessage(messageForStatus, {
        fulfillmentName,
        quantity: totalQuantity
      })}
      <Typography className={classes.orderNumber} variant="body1">
        {fulfillmentName}
      </Typography>
    </>
  );

  return (
    <DefaultCardTitle
      toolbar={toolbar}
      title={
        withStatus ? (
          <StatusLabel label={title} status={selectStatus(status)} />
        ) : (
          title
        )
      }
    />
  );
};

export default CardTitle;
