import { AppUrls } from "@dashboard/apps/urls";
import { ButtonWithTooltip } from "@dashboard/components/ButtonWithTooltip";
import Link from "@dashboard/components/Link";
import { IS_CLOUD_INSTANCE } from "@dashboard/config";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { buttonMessages } from "@dashboard/intl";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "../../../messages";

export const AppInstallButton = ({ manifestUrl }: { manifestUrl: string }) => {
  const intl = useIntl();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

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
      <Link href={AppUrls.resolveAppInstallUrl(manifestUrl)}>
        <Button variant="primary" data-test-id="app-install-button">
          <FormattedMessage {...buttonMessages.install} />
        </Button>
      </Link>
    );
  }

  return (
    <span tabIndex={0}>
      <ButtonWithTooltip
        tooltip={intl.formatMessage(messages.installationCloudOnly)}
        data-test-id="app-install-button"
        disabled
      >
        <FormattedMessage {...buttonMessages.install} />
      </ButtonWithTooltip>
    </span>
  );
};
