import LimitReachedAlert from "@saleor/components/LimitReachedAlert";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export const OrderLimitReached: React.FC = () => {
  const intl = useIntl();

  return (
    <LimitReachedAlert
      title={intl.formatMessage({
        id: "+svQBN",
        defaultMessage: "Order limit reached",
        description: "alert",
      })}
    >
      <FormattedMessage
        id="TPW2tP"
        defaultMessage="You have reached your order limit, you will be billed extra for orders above limit. If you would like to up your limit, contact your administration staff about raising your limits."
      />
    </LimitReachedAlert>
  );
};

OrderLimitReached.displayName = "OrderLimitReached";
export default OrderLimitReached;
