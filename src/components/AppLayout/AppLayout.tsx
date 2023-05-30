import useAppState from "@dashboard/hooks/useAppState";
import { DevModeQuery } from "@dashboard/orders/queries";
import { getFilterVariables } from "@dashboard/orders/views/OrderList/filters";
import { LinearProgress } from "@material-ui/core";
import { useActionBar } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui/next";
import React, { useState } from "react";
import { useLocation } from "react-router";

import { DevModePanel } from "../DevModePanel/DevModePanel";
import { useDevModeContext } from "../DevModePanel/hooks";
import { useDevModeKeyTrigger } from "../DevModePanel/useDevModeKeyTrigger";
import Navigator from "../Navigator";
import { Sidebar } from "../Sidebar";
import { contentMaxWidth } from "./consts";
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
  const [isNavigatorVisible, setNavigatorVisibility] = useState(false);

  const {
    isDevModeVisible,
    setDevModeVisibility,
    setDevModeContent,
    setVariables,
  } = useDevModeContext();

  const params = extractQueryParams(useLocation().search);

  useDevModeKeyTrigger(({ shift }) => {
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
          borderColor="neutralPlain"
          borderRightWidth={1}
          backgroundColor="subdued"
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
            backgroundColor="plain"
            borderTopWidth={1}
            borderTopStyle="solid"
            borderColor="neutralPlain"
            __maxWidth={contentMaxWidth}
            margin="auto"
            zIndex="2"
          />
        </Box>
      </Box>
    </>
  );
};

export default AppLayout;
