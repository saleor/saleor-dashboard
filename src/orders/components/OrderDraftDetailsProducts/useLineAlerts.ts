import { OrderErrorFragment, OrderLineFragment } from "@saleor/graphql";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { lineAlertMessages } from "./messages";

interface UseLineAlertsOpts {
  line: OrderLineFragment;
  error?: OrderErrorFragment;
}

const useLineAlerts = ({ line, error }: UseLineAlertsOpts) => {
  const intl = useIntl();

  const alerts = useMemo(() => {
    const alerts: string[] = [];

    if (error) {
      alerts.push(getOrderErrorMessage(error, intl));
    }

    const product = line.variant?.product;

    if (!product) {
      alerts.push(intl.formatMessage(lineAlertMessages.notExists));
    }

    const isAvailableForPurchase = product?.isAvailableForPurchase;

    if (product && !isAvailableForPurchase) {
      alerts.push(intl.formatMessage(lineAlertMessages.notAvailable));
    }

    return alerts;
  }, [line, error, intl]);

  return alerts;
};
export default useLineAlerts;
