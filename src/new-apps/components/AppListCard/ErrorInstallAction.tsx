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

import { useActionsStyles } from "./styles";

interface InstallErrorActionProps {
  appInstallation?: AppInstallationFragment;
  retryInstall?: () => void;
  removeInstall?: () => void;
}

const InstallErrorAction = ({
  appInstallation,
  retryInstall,
  removeInstall,
}: InstallErrorActionProps) => {
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
InstallErrorAction.displayName = "InstallErrorAction";
export default InstallErrorAction;
