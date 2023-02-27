import { Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

import { channelsAvailabilityDialogMessages as messages } from "./messages";

export const NoChannels = () => (
  <Typography variant="subtitle2">
    <FormattedMessage {...messages.noChannels} />
  </Typography>
);
