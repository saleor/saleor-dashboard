import { ChannelUsabilityDataQuery, OrderDetailsFragment } from "@dashboard/graphql";
import { shippingZonesListPath } from "@dashboard/shipping/urls";
import { Alert, AlertProps } from "@saleor/macaw-ui";
import { sprinkles } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";
import { Link } from "react-router-dom";

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

const OrderDraftAlert = (props: OrderDraftAlertProps) => {
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
            <Link
              to={shippingZonesListPath}
              target="_blank"
              className={sprinkles({
                textDecoration: "underline",
                color: "accent1",
              })}
            >
              <FormattedMessage
                defaultMessage="shipping zones configuration"
                id="T3cLGs"
                description="alert link message"
              />
            </Link>
          ),
        }}
      />
    </Alert>
  );
};

OrderDraftAlert.displayName = "OrderDraftAlert";
export default OrderDraftAlert;
