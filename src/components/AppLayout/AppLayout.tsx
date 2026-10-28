import { AnnouncementsContainer } from "@dashboard/announcements/components/AnnouncementsContainer/AnnouncementsContainer";
import useAppState from "@dashboard/hooks/useAppState";
import { CornerRipplesHost } from "@dashboard/ripples/components/CornerRipplesHost/CornerRipplesHost";
import { LinearProgress } from "@material-ui/core";
import { Box } from "@saleor/macaw-ui-next";
import type * as React from "react";

import { DevModePanel } from "../DevModePanel/DevModePanel";
import NavigatorSearch from "../NavigatorSearch/NavigatorSearch";
import { useSavebarRef } from "../Savebar/SavebarRefContext";
import { Sidebar } from "../Sidebar/Sidebar";
import { SidebarProvider } from "../Sidebar/SidebarContext";
import styles from "./AppLayout.module.css";
import { borderHeight, savebarHeight } from "./consts";
import { useStyles } from "./styles";

interface AppLayoutProps {
  children: React.ReactNode;
  fullSize?: boolean;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const classes = useStyles();
  const { isSavebarMounted, setAnchor } = useSavebarRef();
  const [appState] = useAppState();

  return (
    <SidebarProvider>
      <DevModePanel />
      <NavigatorSearch />

      <div className={styles.layout}>
        {appState.loading && <LinearProgress className={classes.appLoader} color="primary" />}
        <div className={styles.navigation}>
          <Sidebar />
        </div>
        <Box height="100%" width="100%" overflow="hidden">
          <AnnouncementsContainer margin={4} />
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
            borderTopWidth={isSavebarMounted ? 1 : 0}
            borderTopStyle="solid"
            borderColor="default1"
            zIndex="2"
            __height={isSavebarMounted ? savebarHeight : "0"}
            // DetailPageLayout withholds 2× borderHeight (Safari overflow guard); the anchor
            // only adds one border outside its box — overlap so the bar meets sidebar/grid lines.
            __marginTop={isSavebarMounted ? `-${borderHeight}` : 0}
            overflow="hidden"
          />
        </Box>
      </div>
      {/* Fixed to the viewport bottom-left (nav corner); keep out of SidebarContent to avoid double-mount in drawer layouts. */}
      <CornerRipplesHost />
    </SidebarProvider>
  );
};

export default AppLayout;
