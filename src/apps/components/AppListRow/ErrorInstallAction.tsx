import { appInstallationStatusMessages } from "@dashboard/apps/messages";
import { AppInstallationFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { Button, Indicator, TooltipMountWrapper } from "@saleor/macaw-ui";
import { Text, Tooltip } from "@saleor/macaw-ui-next";
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
      <Text className={classes.cardActionsIssueText} data-test-id="app-installation-failed">
        <FormattedMessage {...appInstallationStatusMessages.failed} />
        <Tooltip>
          <Tooltip.Trigger>
            <TooltipMountWrapper>
              <Indicator icon="error" />
            </TooltipMountWrapper>
          </Tooltip.Trigger>
          <Tooltip.Content side="bottom">
            <Tooltip.Arrow />
            {appInstallation?.message}
          </Tooltip.Content>
        </Tooltip>
      </Text>
      {retryInstall && (
        <Button variant="secondary" onClick={retryInstall} data-test-id="app-retry-install-button">
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
