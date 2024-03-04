import useAppState from "@dashboard/hooks/useAppState";
import { DevModeQuery } from "@dashboard/orders/queries";
import { getFilterVariables } from "@dashboard/orders/views/OrderList/filters";
import { LinearProgress } from "@material-ui/core";
import { useActionBar } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useLocation } from "react-router";

import { DevModePanel } from "../DevModePanel/DevModePanel";
import { useDevModeContext } from "../DevModePanel/hooks";
import { useDevModeKeyTrigger } from "../DevModePanel/useDevModeKeyTrigger";
import Navigator from "../Navigator";
import { useNavigatorContext } from "../Navigator/useNavigatorContext";
import { Sidebar } from "../Sidebar";
import { useStyles } from "./styles";
import { extractQueryParams } from "./util";

interface AppLayoutProps {
  children: React.ReactNode;
  fullSize?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const classes = useStyles();
  const { anchor: appActionAnchor } = useActionBar();
  const [appState] = useAppState();

  const {
    isDevModeVisible,
    setDevModeVisibility,
    setDevModeContent,
    setVariables,
  } = useDevModeContext();

  const { isNavigatorVisible, setNavigatorVisibility } = useNavigatorContext();

  const params = extractQueryParams(useLocation().search);

  useDevModeKeyTrigger((_err, { shift }) => {
    if (shift) {
      setDevModeContent(DevModeQuery);
      const variables = JSON.stringify(
        {
          filter: getFilterVariables(params),
        },
        null,
        2,
      );
      setVariables(variables);
    } else {
      setDevModeContent("");
      setVariables("");
    }
    setDevModeVisibility(!isDevModeVisible);
  });

  return (
    <>
      <DevModePanel
        isDevModeVisible={isDevModeVisible}
        setDevModeVisibility={setDevModeVisibility}
      />
      <Navigator
        visible={isNavigatorVisible}
        setVisibility={setNavigatorVisibility}
      />
      <Box display="grid" __gridTemplateColumns="auto 1fr">
        {appState.loading && (
          <LinearProgress className={classes.appLoader} color="primary" />
        )}
        <Box
          height="100vh"
          borderColor="default1"
          borderRightWidth={1}
          backgroundColor="default2"
          borderStyle="solid"
          position="sticky"
          top={0}
          borderLeftWidth={0}
          borderTopWidth={0}
          borderBottomWidth={0}
        >
          <Sidebar />
        </Box>
        <Box height="100%" width="100%">
          <Box as="main" width="100%">
            {children}
          </Box>
          <Box
            ref={appActionAnchor}
            position="sticky"
            bottom={0}
            left={0}
            right={0}
            backgroundColor="default1"
            borderTopWidth={1}
            borderTopStyle="solid"
            borderColor="default1"
            zIndex="2"
          />
        </Box>
      </Box>
    </>
  );
};

export default AppLayout;
