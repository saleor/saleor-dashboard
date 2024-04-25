import { Typography } from "@material-ui/core";
import { Alert } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import msgs from "./messages";
import { useStyles } from "./styles";

interface MarketplaceAlertProps {
  error?: Error;
}

export const MarketplaceAlert: React.FC<MarketplaceAlertProps> = ({ error }) => {
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
      <Typography>
        <FormattedMessage
          {...msgs.marketplaceErrorMessage}
          values={{
            message: <b>{error.message}</b>,
          }}
        />
      </Typography>
    </Alert>
  );
};
MarketplaceAlert.displayName = "MarketplaceAlert";
export default MarketplaceAlert;
