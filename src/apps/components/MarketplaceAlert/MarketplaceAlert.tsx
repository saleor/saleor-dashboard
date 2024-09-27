import { Alert } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import msgs from "./messages";
import { useStyles } from "./styles";

interface MarketplaceAlertProps {
  error?: Error;
}

const MarketplaceAlert: React.FC<MarketplaceAlertProps> = ({ error }) => {
  const classes = useStyles();
  const intl = useIntl();

  if (!error) {
    return null;
  }

  return (
    <Alert
      variant="warning"
      className={clsx(classes.alert, "remove-icon-background")}
      close={true}
      title={intl.formatMessage(msgs.marketplaceError)}
    >
      <Text>
        <FormattedMessage
          {...msgs.marketplaceErrorMessage}
          values={{
            message: <b>{error.message}</b>,
          }}
        />
      </Text>
    </Alert>
  );
};

MarketplaceAlert.displayName = "MarketplaceAlert";
export default MarketplaceAlert;
