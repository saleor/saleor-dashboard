import { appInstallationStatusMessages } from "@dashboard/new-apps/messages";
import { Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useActionsStyles } from "./styles";

const InstallPendingText = () => {
  const classes = useActionsStyles();

  return (
    <Typography
      className={classes.cardActionsText}
      data-test-id="app-installation-pending"
    >
      <FormattedMessage {...appInstallationStatusMessages.pending} />
    </Typography>
  );
};
InstallPendingText.displayName = "InstallPendingText";
export default InstallPendingText;
