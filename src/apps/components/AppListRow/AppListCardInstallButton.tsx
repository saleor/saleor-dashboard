import { IS_CLOUD_INSTANCE } from "@dashboard/config";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { buttonMessages } from "@dashboard/intl";
import { Button, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface AppListCardInstallButtonProps {
  installHandler?: () => void;
}

export const AppListCardInstallButton = ({
  installHandler,
}: AppListCardInstallButtonProps) => {
  const intl = useIntl();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  if (!hasManagedAppsPermission) {
    return (
      <Tooltip>
        <Tooltip.Trigger>
          <span tabIndex={0}>
            <Button
              variant="primary"
              style={{ pointerEvents: "none" }}
              disabled
            >
              <FormattedMessage {...buttonMessages.install} />
            </Button>
          </span>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <Tooltip.Arrow />
          {intl.formatMessage(messages.installationPermissionRequired)}
        </Tooltip.Content>
      </Tooltip>
    );
  }

  if (installHandler && IS_CLOUD_INSTANCE) {
    return (
      <Button
        variant="primary"
        onClick={installHandler}
        data-test-id="app-install-button"
      >
        <FormattedMessage {...buttonMessages.install} />
      </Button>
    );
  }

  if (installHandler && !IS_CLOUD_INSTANCE) {
    return (
      <Tooltip>
        <Tooltip.Trigger>
          <span tabIndex={0}>
            <Button
              variant="primary"
              onClick={installHandler}
              data-test-id="app-install-button"
              style={{ pointerEvents: "none" }}
              disabled
            >
              <FormattedMessage {...buttonMessages.install} />
            </Button>
          </span>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <Tooltip.Arrow />
          {intl.formatMessage(messages.installationCloudOnly)}
        </Tooltip.Content>
      </Tooltip>
    );
  }

  return null;
};
