// @ts-strict-ignore
import notFoundImage from "@assets/images/what.svg";
import useAppState from "@dashboard/hooks/useAppState";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Button, sprinkles, Text } from "@saleor/macaw-ui-next";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage } from "react-intl";

import messages from "./messages";

interface ErrorPageProps {
  onBack: () => void;
  onRefresh: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ onBack, onRefresh }) => {
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
    <Box alignItems="center" display="flex" height="100vh">
      <Box
        display="grid"
        gridTemplateColumns={{
          mobile: 1,
          tablet: 1,
          desktop: 2,
        }}
        __margin="0 auto"
        gap={4}
        padding={4}
      >
        <SVG className={sprinkles({ width: "100%" })} src={notFoundImage} />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          textAlign={{
            mobile: "center",
            tablet: "center",
            desktop: "left",
          }}
        >
          <div>
            <Text size={11} fontWeight="bold">
              <FormattedMessage {...messages.header} />
            </Text>
            <Text display="block" marginTop={4}>
              <FormattedMessage {...messages.content} />
            </Text>
            {!!errorTrackingId && (
              <Box marginTop={4}>
                <Text
                  size={2}
                  fontWeight="medium"
                  color="default2"
                  marginTop={4}
                  textTransform="uppercase"
                >
                  Error ID
                </Text>
                <Text size={4} fontWeight="regular" display="block">
                  {errorTrackingId}
                </Text>
              </Box>
            )}
          </div>
          <Box marginTop={4} display="flex" flexDirection="row" alignItems="center" gap={2}>
            <Button variant="primary" onClick={handleOnBack}>
              <FormattedMessage {...messages.btnDashboard} />
            </Button>
            <Box display="inline-block" marginX={1}>
              <FormattedMessage {...messages.or} />
            </Box>
            <Button variant="secondary" onClick={onRefresh}>
              <FormattedMessage {...messages.btnRefresh} />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

ErrorPage.displayName = "ErrorPage";
export default ErrorPage;
