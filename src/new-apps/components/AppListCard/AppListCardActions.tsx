import { Button } from "@dashboard/components/Button";
import Hr from "@dashboard/components/Hr";
import { AppInstallationFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { appInstallationStatusMessages } from "@dashboard/new-apps/messages";
import { CardActions, Typography } from "@material-ui/core";
import { Indicator, Tooltip, TooltipMountWrapper } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";
import { useActionsStyles } from "./styles";

interface AppListCardActionsProps {
  releaseDate: string | undefined;
  installationPending?: boolean;
  appInstallation?: AppInstallationFragment;
  installHandler?: () => void;
  vercelDeployHandler?: () => void;
  retryInstallHandler?: () => void;
  removeInstallHandler?: () => void;
}

const AppListCardActions: React.FC<AppListCardActionsProps> = ({
  releaseDate,
  installationPending = false,
  appInstallation,
  installHandler,
  vercelDeployHandler,
  retryInstallHandler,
  removeInstallHandler,
}) => {
  const classes = useActionsStyles();

  if (
    !installHandler &&
    !vercelDeployHandler &&
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
        {vercelDeployHandler && (
          <Button
            variant="secondary"
            onClick={vercelDeployHandler}
            data-test-id="app-deploy-to-vercel-button"
          >
            <FormattedMessage {...messages.deployToVercel} />
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
        {(retryInstallHandler || removeInstallHandler) && (
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
            {retryInstallHandler && (
              <Button
                variant="secondary"
                onClick={retryInstallHandler}
                data-test-id="app-retry-install-button"
              >
                <FormattedMessage {...buttonMessages.retry} />
              </Button>
            )}
            {removeInstallHandler && (
              <Button
                variant="secondary"
                onClick={removeInstallHandler}
                data-test-id="app-remove-install-button"
              >
                <FormattedMessage {...buttonMessages.cancel} />
              </Button>
            )}
          </>
        )}
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
