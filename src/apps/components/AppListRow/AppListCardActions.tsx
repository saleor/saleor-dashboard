import { appInstallationStatusMessages } from "@dashboard/apps/messages";
import { AppInstallationFragment } from "@dashboard/graphql";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { AppListCardInstallButton } from "./AppListCardInstallButton";
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

const AppListCardActions = ({
  releaseDate,
  installationPending = false,
  appInstallation,
  installHandler,
  githubForkHandler,
  retryInstallHandler,
  removeInstallHandler,
}: AppListCardActionsProps) => {
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
    <Box display="flex" justifyContent="flex-end" gap={3}>
      {githubForkHandler && (
        <Button
          variant="secondary"
          onClick={githubForkHandler}
          data-test-id="app-fork-on-github-button"
        >
          <FormattedMessage {...messages.forkOnGithub} />
        </Button>
      )}

      {installHandler && <AppListCardInstallButton installHandler={installHandler} />}

      {installationPending && (
        <Text color="default2" size={3} data-test-id="app-installation-pending">
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
