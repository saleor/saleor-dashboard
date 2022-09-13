import { CardContent, Typography } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

import { variantDetailsChannelsAvailabilityCardMessages as messages } from "../messages";
import CardContainer from "./VariantDetailsChannelsAvailabilityCardContainer";

export const NotAvailable: React.FC = () => {
  const intl = useIntl();

  return (
    <CardContainer>
      <CardContent>
        <Typography variant="caption">
          {intl.formatMessage(messages.noItemsAvailable)}
        </Typography>
      </CardContent>
    </CardContainer>
  );
};
