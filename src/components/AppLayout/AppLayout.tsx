import useAppState from "@dashboard/hooks/useAppState";
import { LinearProgress } from "@material-ui/core";
import { useActionBar } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import { DevModePanel } from "../DevModePanel/DevModePanel";
import NavigatorSearch from "../NavigatorSearch";
import { Sidebar } from "../Sidebar";
import { useStyles } from "./styles";

interface AppLayoutProps {
  children: React.ReactNode;
  fullSize?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const classes = useStyles();
  const { anchor: appActionAnchor } = useActionBar();
  const [appState] = useAppState();

  return (
    <>
      <DevModePanel />
      <NavigatorSearch />

      <Box display="grid" __gridTemplateColumns="auto 1fr">
        {appState.loading && <LinearProgress className={classes.appLoader} color="primary" />}
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
