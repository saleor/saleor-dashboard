import { OrderErrorFragment, OrderLineFragment } from "@saleor/graphql";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { lineAlertMessages } from "./messages";

interface UseLineAlertsOpts {
  line: OrderLineFragment;
  channelId: string;
  error?: OrderErrorFragment;
}

const useLineAlerts = ({ line, channelId, error }: UseLineAlertsOpts) => {
  const intl = useIntl();

  const alerts = useMemo(() => {
    const {
      variant: {
        product: { channelListings },
      },
    } = line;
    const channelListing = channelListings.find(
      channelListing => channelListing.channel.id === channelId,
    );
    const isPublished = channelListing?.isPublished;
    const isAvailable = channelListing?.isAvailableForPurchase;

    const alerts: string[] = [];

    if (error) {
      alerts.push(getOrderErrorMessage(error, intl));
    }
    if (!isPublished) {
      alerts.push(intl.formatMessage(lineAlertMessages.notPublished));
    }
    if (!isAvailable) {
      alerts.push(intl.formatMessage(lineAlertMessages.notAvailable));
    }

    return alerts;
  }, [line, channelId, error]);

  return alerts;
};
export default useLineAlerts;
