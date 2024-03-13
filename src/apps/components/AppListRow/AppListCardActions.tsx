import { appInstallationStatusMessages } from "@dashboard/apps/messages";
import { IS_CLOUD_INSTANCE } from "@dashboard/config";
import { AppInstallationFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Text, Tooltip } from "@saleor/macaw-ui-next";
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
    <Box
      display="flex"
      justifyContent="flex-end"
      gap={3}
      borderStyle="solid"
      borderWidth={1}
      borderBottomLeftRadius={3}
      borderBottomRightRadius={3}
      borderColor="default1"
      borderTopStyle="none"
      padding={5}
    >
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
      )}
      {installationPending && (
        <Text
          color="default2"
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
        <Text color="default2" size={3}>
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
