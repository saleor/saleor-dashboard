import { CardActions, Typography } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import Hr from "@saleor/components/Hr";
import { buttonMessages } from "@saleor/intl";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";
import { useActionsStyles } from "./styles";

interface AppListCardActionsProps {
  releaseDate: string | undefined;
  installHandler?: () => void;
  vercelDeployHandler?: () => void;
}

const AppListCardActions: React.FC<AppListCardActionsProps> = ({
  releaseDate,
  installHandler,
  vercelDeployHandler,
}) => {
  const classes = useActionsStyles();

  if (!installHandler && !vercelDeployHandler && !releaseDate) {
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
