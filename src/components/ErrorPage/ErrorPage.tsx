// @ts-strict-ignore
import notFoundImage from "@assets/images/what.svg";
import useAppState from "@dashboard/hooks/useAppState";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Typography } from "@material-ui/core";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage } from "react-intl";

import messages from "./messages";
import useStyles from "./styles";

export interface ErrorPageProps {
  onBack: () => void;
  onRefresh: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ onBack, onRefresh }) => {
  const classes = useStyles();
  const navigate = useNavigator();
  const [appState, dispatchAppState] = useAppState();
  const handleOnBack = () => {
    navigate("/", { replace: true });
    dispatchAppState({
      payload: {
        error: null,
      },
      type: "displayError",
    });
    onBack();
  };
  const errorTrackingId = appState.error?.type === "unhandled" ? appState.error.id : null;

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <SVG className={classes.notFoundImage} src={notFoundImage} />
        <div className={classes.innerContainer}>
          <div>
            <Typography className={classes.header} variant="h1">
              <FormattedMessage {...messages.header} />
            </Typography>
            <Typography>
              <FormattedMessage {...messages.content} />
            </Typography>
            {!!errorTrackingId && (
              <div>
                <Typography variant="caption" color="textSecondary" className={classes.errorId}>
                  Error ID
                </Typography>
                <Typography variant="body1">{errorTrackingId}</Typography>
              </div>
            )}
          </div>
          <div className={classes.buttonContainer}>
            <Button variant="primary" onClick={handleOnBack}>
              <FormattedMessage {...messages.btnDashboard} />
            </Button>
            <div className={classes.conjunction}>
              <FormattedMessage {...messages.or} />
            </div>
            <Button variant="secondary" onClick={onRefresh}>
              <FormattedMessage {...messages.btnRefresh} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

ErrorPage.displayName = "ErrorPage";
export default ErrorPage;
