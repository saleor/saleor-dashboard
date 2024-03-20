import { ButtonWithTooltip } from "@dashboard/components/ButtonWithTooltip";
import { IS_CLOUD_INSTANCE } from "@dashboard/config";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { buttonMessages } from "@dashboard/intl";
import { Button } from "@saleor/macaw-ui-next";
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

  if (!installHandler) {
    return null;
  }

  if (!hasManagedAppsPermission) {
    return (
      <ButtonWithTooltip
        variant="primary"
        disabled
        tooltip={intl.formatMessage(buttonMessages.noPermission)}
      >
        <FormattedMessage {...buttonMessages.install} />
      </ButtonWithTooltip>
    );
  }

  if (IS_CLOUD_INSTANCE) {
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

  return (
    <span tabIndex={0}>
      <ButtonWithTooltip
        tooltip={intl.formatMessage(messages.installationCloudOnly)}
        onClick={installHandler}
        data-test-id="app-install-button"
        disabled
      >
        <FormattedMessage {...buttonMessages.install} />
      </ButtonWithTooltip>
    </span>
  );
};
