import useAppState from "@dashboard/hooks/useAppState";
import { LinearProgress } from "@material-ui/core";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import { DevModePanel } from "../DevModePanel/DevModePanel";
import NavigatorSearch from "../NavigatorSearch";
import { useSavebarRef } from "../Savebar/SavebarRefContext";
import { ServiceWorkerPrompt } from "../ServiceWorkerPrompt";
import { Sidebar } from "../Sidebar";
import { useStyles } from "./styles";

interface AppLayoutProps {
  children: React.ReactNode;
  fullSize?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const classes = useStyles();
  const { setAnchor } = useSavebarRef();
  const [appState] = useAppState();

  return (
    <>
      <DevModePanel />
      <NavigatorSearch />

      <Box
        display="grid"
        height="100vh"
        __gridTemplateColumns="auto 1fr"
        __gridTemplateRows="auto 1fr"
      >
        {appState.loading && <LinearProgress className={classes.appLoader} color="primary" />}
        <ServiceWorkerPrompt />
        <Box
          height="100%"
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
        <Box height="100%" width="100%" overflow="hidden">
          <Box as="main" width="100%" height="100%">
            {children}
          </Box>
          <Box
            ref={setAnchor}
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
