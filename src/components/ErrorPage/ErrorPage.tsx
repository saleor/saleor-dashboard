// @ts-strict-ignore
import notFoundImage from "@assets/images/what.svg";
import useAppState from "@dashboard/hooks/useAppState";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Button } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
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
            <Text className={classes.header} size={11} fontWeight="bold">
              <FormattedMessage {...messages.header} />
            </Text>
            <Text>
              <FormattedMessage {...messages.content} />
            </Text>
            {!!errorTrackingId && (
              <div>
                <Text size={2} fontWeight="light" color="default2" className={classes.errorId}>
                  Error ID
                </Text>
                <Text size={4} fontWeight="regular">
                  {errorTrackingId}
                </Text>
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
