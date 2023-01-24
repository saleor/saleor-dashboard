import { useUser } from "@dashboard/auth";
import useAppState from "@dashboard/hooks/useAppState";
import { isDarkTheme } from "@dashboard/misc";
import { LinearProgress } from "@material-ui/core";
import { useActionBar, useBacklink, useTheme } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";

import Container from "../Container";
import Navigator from "../Navigator";
import NavigatorButton from "../NavigatorButton/NavigatorButton";
import { Sidebar, SidebarDrawer } from "../Sidebar";
import UserChip from "../UserChip";
import useAppChannel from "./AppChannelContext";
import AppChannelSelect from "./AppChannelSelect";
import { useFullSizeStyles, useStyles } from "./styles";

interface AppLayoutProps {
  children: React.ReactNode;
  fullSize?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  fullSize = false,
}) => {
  const classes = useStyles();
  const fullSizeClasses = useFullSizeStyles();
  const { themeType, setTheme } = useTheme();
  const { anchor: appActionAnchor } = useActionBar();
  const appHeaderAnchor = useBacklink();
  const { logout, user } = useUser();
  const [appState] = useAppState();
  const [isNavigatorVisible, setNavigatorVisibility] = React.useState(false);

  const {
    availableChannels,
    channel,
    isPickerActive,
    setChannel,
  } = useAppChannel(false);

  const toggleTheme = () => setTheme(isDarkTheme(themeType) ? "light" : "dark");

  return (
    <>
      <Navigator
        visible={isNavigatorVisible}
        setVisibility={setNavigatorVisibility}
      />
      <div className={classes.root}>
        <Sidebar />
        <div
          className={clsx(classes.content, {
            [fullSizeClasses.content]: fullSize,
          })}
        >
          {appState.loading ? (
            <LinearProgress className={classes.appLoader} color="primary" />
          ) : (
            <div className={classes.appLoaderPlaceholder} />
          )}
          <div
            className={clsx(classes.viewContainer, {
              [fullSizeClasses.viewContainer]: fullSize,
            })}
          >
            <div>
              <Container>
                <div className={classes.header}>
                  <div className={classes.headerAnchor} ref={appHeaderAnchor} />
                  <div className={classes.headerToolbar}>
                    <SidebarDrawer />
                    <div className={classes.spacer} />
                    <div className={classes.userBar}>
                      <NavigatorButton
                        isMac={navigator.platform.toLowerCase().includes("mac")}
                        onClick={() => setNavigatorVisibility(true)}
                      />
                      {isPickerActive && (
                        <AppChannelSelect
                          channels={availableChannels}
                          selectedChannelId={channel?.id}
                          onChannelSelect={setChannel}
                        />
                      )}
                      <UserChip
                        isDarkThemeEnabled={isDarkTheme(themeType)}
                        user={user}
                        onLogout={logout}
                        onThemeToggle={toggleTheme}
                      />
                    </div>
                  </div>
                </div>
              </Container>
            </div>
            <main
              className={clsx(classes.view, {
                [classes.viewMargins]: !fullSize,
                [fullSizeClasses.view]: fullSize,
              })}
            >
              {children}
            </main>
          </div>
          <div className={classes.appAction} ref={appActionAnchor} />
        </div>
      </div>
    </>
  );
};

export default AppLayout;
