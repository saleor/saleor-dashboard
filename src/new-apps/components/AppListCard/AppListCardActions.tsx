import { IS_CLOUD_INSTANCE } from "@dashboard/config";
import { AppInstallationFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { appInstallationStatusMessages } from "@dashboard/new-apps/messages";
import { Tooltip } from "@material-ui/core";
import { Box, Button, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import InstallErrorAction from "./ErrorInstallAction";
import { messages } from "./messages";

interface AppListCardActionsProps {
  releaseDate: string | undefined;
  installationPending?: boolean;
  appInstallation?: AppInstallationFragment;
  installHandler?: () => void;
  githubForkHandler?: () => void;
  retryInstallHandler?: () => void;
  removeInstallHandler?: () => void;
}

const AppListCardActions: React.FC<AppListCardActionsProps> = ({
  releaseDate,
  installationPending = false,
  appInstallation,
  installHandler,
  githubForkHandler,
  retryInstallHandler,
  removeInstallHandler,
}) => {
  const intl = useIntl();

  if (
    !installHandler &&
    !githubForkHandler &&
    !releaseDate &&
    !retryInstallHandler &&
    !removeInstallHandler &&
    !installationPending
  ) {
    return null;
  }

  return (
    <Box display="flex" justifyContent="flex-end" gap={6}>
      {githubForkHandler && (
        <Button
          variant="secondary"
          onClick={githubForkHandler}
          data-test-id="app-fork-on-github-button"
        >
          <FormattedMessage {...messages.forkOnGithub} />
        </Button>
      )}
      {installHandler && IS_CLOUD_INSTANCE && (
        <Button
          variant="primary"
          onClick={installHandler}
          data-test-id="app-install-button"
        >
          <FormattedMessage {...buttonMessages.install} />
        </Button>
      )}
      {installHandler && !IS_CLOUD_INSTANCE && (
        <Tooltip
          placement="top"
          title={intl.formatMessage(messages.installationCloudOnly)}
        >
          <div>
            <Button
              variant="primary"
              onClick={installHandler}
              data-test-id="app-install-button"
              disabled
            >
              <FormattedMessage {...buttonMessages.install} />
            </Button>
          </div>
        </Tooltip>
      )}
      {installationPending && (
        <Text
          color="textNeutralSubdued"
          variant="body"
          size="small"
          data-test-id="app-installation-pending"
        >
          <FormattedMessage {...appInstallationStatusMessages.pending} />
        </Text>
      )}
      <InstallErrorAction
        appInstallation={appInstallation}
        retryInstall={retryInstallHandler}
        removeInstall={removeInstallHandler}
      />
      {releaseDate && (
        <Text color="textNeutralSubdued" variant="body" size="small">
          <FormattedMessage
            {...messages.releaseComingSoon}
            values={{
              releaseDate,
            }}
          />
        </Text>
      )}
    </Box>
  );
};
AppListCardActions.displayName = "AppListCardActions";
export default AppListCardActions;
