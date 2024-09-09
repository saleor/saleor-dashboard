import { ChannelUsabilityDataQuery, OrderDetailsFragment } from "@dashboard/graphql";
import { shippingZonesListPath } from "@dashboard/shipping/urls";
import { Alert, AlertProps } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";
import urlJoin from "url-join";

import OrderAlerts from "../OrderAlerts";
import { alertMessages } from "./messages";
import { useAlertStyles } from "./styles";

const getAlerts = (
  order?: OrderDetailsFragment,
  channelUsabilityData?: ChannelUsabilityDataQuery,
) => {
  const canDetermineShippingMethods =
    order?.shippingAddress?.country.code && !!order?.lines?.length;
  const isChannelInactive = order && !order.channel.isActive;
  const noProductsInChannel = channelUsabilityData?.products?.totalCount === 0;
  const noShippingMethodsInChannel =
    canDetermineShippingMethods && order?.shippingMethods.length === 0;

  let alerts: MessageDescriptor[] = [];

  if (isChannelInactive) {
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
  order?: OrderDetailsFragment;
  channelUsabilityData?: ChannelUsabilityDataQuery;
};

const OrderDraftAlert: React.FC<OrderDraftAlertProps> = props => {
  const { order, channelUsabilityData, ...alertProps } = props;
  const classes = useAlertStyles();
  const intl = useIntl();
  const alerts = getAlerts(order, channelUsabilityData);

  if (!alerts.length) {
    return null;
  }

  return (
    <Alert
      variant="warning"
      close
      className={clsx(classes.root, "remove-icon-background")}
      {...alertProps}
    >
      <OrderAlerts
        alerts={alerts}
        alertsHeader={intl.formatMessage(alertMessages.manyAlerts)}
        values={{
          country: order?.shippingAddress?.country.country,
          configLink: (
            <Box
              as="a"
              textDecoration="underline"
              href={urlJoin(shippingZonesListPath)}
              color="accent1"
              target="_blank"
            >
              <FormattedMessage
                defaultMessage="shipping zones configuration"
                id="T3cLGs"
                description="alert link message"
              />
            </Box>
          ),
        }}
      />
    </Alert>
  );
};

OrderDraftAlert.displayName = "OrderDraftAlert";
export default OrderDraftAlert;
