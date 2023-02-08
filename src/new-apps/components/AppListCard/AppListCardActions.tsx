import { Button } from "@dashboard/components/Button";
import Hr from "@dashboard/components/Hr";
import { AppInstallationFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { appInstallationStatusMessages } from "@dashboard/new-apps/messages";
import { CardActions, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

import InstallErrorAction from "./ErrorInstallAction";
import { messages } from "./messages";
import { useActionsStyles } from "./styles";

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
  const classes = useActionsStyles();

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
    <>
      <Hr />
      <CardActions className={classes.cardActions}>
        {githubForkHandler && (
          <Button
            variant="secondary"
            onClick={githubForkHandler}
            data-test-id="app-fork-on-github-button"
          >
            <FormattedMessage {...messages.forkOnGithub} />
          </Button>
        )}
        {installHandler && (
          <Button
            variant="primary"
            onClick={installHandler}
            data-test-id="app-install-button"
          >
            <FormattedMessage {...buttonMessages.install} />
          </Button>
        )}
        {installationPending && (
          <Typography
            className={classes.cardActionsText}
            data-test-id="app-installation-pending"
          >
            <FormattedMessage {...appInstallationStatusMessages.pending} />
          </Typography>
        )}
        <InstallErrorAction
          appInstallation={appInstallation}
          retryInstall={retryInstallHandler}
          removeInstall={removeInstallHandler}
        />
        {releaseDate && (
          <Typography className={classes.releaseDate}>
            <FormattedMessage
              {...messages.releaseComingSoon}
              values={{
                releaseDate,
              }}
            />
          </Typography>
        )}
      </CardActions>
    </>
  );
};
AppListCardActions.displayName = "AppListCardActions";
export default AppListCardActions;
