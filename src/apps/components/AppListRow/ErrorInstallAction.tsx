import { appInstallationStatusMessages } from "@dashboard/apps/messages";
import { AppInstallationFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { Typography } from "@material-ui/core";
import { Button, Indicator, TooltipMountWrapper } from "@saleor/macaw-ui";
import { sprinkles, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

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
  if (!retryInstall && !removeInstall) {
    return null;
  }

  return (
    <>
      <Typography
        className={sprinkles({
          width: "100%",
          color: "critical1",
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 2,
        })}
        data-test-id="app-installation-failed"
      >
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
      </Typography>
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
