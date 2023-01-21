import { AppInstallationFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { appInstallationStatusMessages } from "@dashboard/new-apps/messages";
import { Typography } from "@material-ui/core";
import {
  Button,
  Indicator,
  Tooltip,
  TooltipMountWrapper,
} from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useActionsStyles } from "../AppListCard/styles";

export interface InstallErrorActionsProps {
  appInstallation?: AppInstallationFragment;
  retryInstall?: () => void;
  removeInstall?: () => void;
}

const InstallErrorActions = ({
  appInstallation,
  retryInstall,
  removeInstall,
}: InstallErrorActionsProps) => {
  const classes = useActionsStyles();

  if (!retryInstall && !removeInstall) {
    return null;
  }

  return (
    <>
      <Typography
        className={classes.cardActionsIssueText}
        data-test-id="app-installation-failed"
      >
        <FormattedMessage {...appInstallationStatusMessages.failed} />
        <Tooltip title={appInstallation?.message} variant="error">
          <TooltipMountWrapper>
            <Indicator icon="error" />
          </TooltipMountWrapper>
        </Tooltip>
      </Typography>
      {retryInstall && (
        <Button
          variant="secondary"
          onClick={retryInstall}
          data-test-id="app-retry-install-button"
        >
          <FormattedMessage {...buttonMessages.retry} />
        </Button>
      )}
      {removeInstall && (
        <Button
          variant="secondary"
          onClick={removeInstall}
          data-test-id="app-remove-install-button"
        >
          <FormattedMessage {...buttonMessages.cancel} />
        </Button>
      )}
    </>
  );
};
InstallErrorActions.displayName = "InstallErrorActions";
export default InstallErrorActions;
