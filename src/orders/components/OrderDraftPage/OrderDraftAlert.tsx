import {
  ChannelUsabilityDataQuery,
  OrderDetailsFragment,
} from "@saleor/graphql";
import { Alert, AlertProps } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, MessageDescriptor } from "react-intl";

import { alertMessages } from "./messages";
import { useAlertStyles } from "./styles";

const getAlerts = (
  order: OrderDetailsFragment,
  channelUsabilityData?: ChannelUsabilityDataQuery,
) => {
  const inactiveChannel = !order.channel.isActive;
  const noProductsInChannel = channelUsabilityData?.products.totalCount === 0;
  const noShippingMethodsInChannel = order.shippingMethods.length === 0;

  let alerts: MessageDescriptor[] = [];

  if (inactiveChannel) {
    alerts = [...alerts, alertMessages.inactiveChannel];
  }
  if (noProductsInChannel) {
    alerts = [...alerts, alertMessages.noProductsInChannel];
  }
  if (noShippingMethodsInChannel) {
    alerts = [...alerts, alertMessages.noShippingMethodsInChannel];
  }

  return alerts;
};

export type OrderDraftAlertProps = Omit<AlertProps, "variant" | "close"> & {
  order: OrderDetailsFragment;
  channelUsabilityData?: ChannelUsabilityDataQuery;
};

const OrderDraftAlert: React.FC<OrderDraftAlertProps> = props => {
  const { order, channelUsabilityData, ...alertProps } = props;
  const classes = useAlertStyles();

  const alerts = getAlerts(order, channelUsabilityData);

  if (alerts.length === 0) {
    return null;
  }

  return (
    <Alert variant="warning" close className={classes.root} {...alertProps}>
      {alerts.length > 1 ? (
        <>
          <FormattedMessage {...alertMessages.manyAlerts} />
          <ul>
            {alerts.map((alert, index) => (
              <li key={index}>
                <FormattedMessage {...alert} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <FormattedMessage {...alerts[0]} />
      )}
    </Alert>
  );
};

OrderDraftAlert.displayName = "OrderDraftAlert";
export default OrderDraftAlert;
