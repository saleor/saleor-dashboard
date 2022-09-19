import { CardContent, Typography } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

import { variantDetailsChannelsAvailabilityCardMessages as messages } from "./../messages";

export const NotAvailable: React.FC = () => {
  const intl = useIntl();

  return (
    <CardContent>
      <Typography variant="caption">
        {intl.formatMessage(messages.noItemsAvailable)}
      </Typography>
    </CardContent>
  );
};
