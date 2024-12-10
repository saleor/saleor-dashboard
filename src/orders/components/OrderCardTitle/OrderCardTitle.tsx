import DefaultCardTitle from "@dashboard/components/CardTitle";
import HorizontalSpacer from "@dashboard/components/HorizontalSpacer";
import { FulfillmentStatus } from "@dashboard/graphql";
import { StatusType } from "@dashboard/types";
import { CircleIndicator } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { orderTitleMessages } from "./messages";
import { useStyles } from "./styles";
import { getOrderTitleMessage } from "./utils";

export type CardTitleStatus = FulfillmentStatus | "unfulfilled";

export type CardTitleLines = Array<{
  quantity: number;
  quantityToFulfill?: number;
}>;

interface OrderCardTitleProps {
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
const OrderCardTitle = ({
  status,
  warehouseName,
  withStatus = false,
  toolbar,
  className,
}: OrderCardTitleProps) => {
  const intl = useIntl();
  const classes = useStyles({});
  const messageForStatus = getOrderTitleMessage(status);

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
          <Text className={classes.cardHeader}>{intl.formatMessage(messageForStatus)}</Text>
          {!!warehouseName && (
            <Text className={classes.warehouseName} size={2} fontWeight="light">
              <FormattedMessage
                {...orderTitleMessages.fulfilledFrom}
                values={{
                  warehouseName,
                }}
              />
            </Text>
          )}
        </div>
      }
    />
  );
};

OrderCardTitle.displayName = "OrderCardTitle";
export default OrderCardTitle;
