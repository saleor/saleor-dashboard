import { LinearProgress, useMediaQuery } from "@material-ui/core";
import { useUser } from "@saleor/auth";
import useAppState from "@saleor/hooks/useAppState";
import {
  SaleorTheme,
  Sidebar,
  SidebarDrawer,
  useActionBar,
  useBacklink,
  useTheme,
} from "@saleor/macaw-ui";
import { isDarkTheme } from "@saleor/misc";
import clsx from "clsx";
import React from "react";
import { useIntl } from "react-intl";
import useRouter from "use-react-router";

import Container from "../Container";
import Navigator from "../Navigator";
import NavigatorButton from "../NavigatorButton/NavigatorButton";
import UserChip from "../UserChip";
import useAppChannel from "./AppChannelContext";
import AppChannelSelect from "./AppChannelSelect";
import useMenuStructure from "./menuStructure";
import { SidebarLink } from "./SidebarLink";
import { useFullSizeStyles, useStyles } from "./styles";
import { isMenuActive } from "./utils";

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
  const intl = useIntl();
  const [appState] = useAppState();
  const { location } = useRouter();
  const [isNavigatorVisible, setNavigatorVisibility] = React.useState(false);
  const isMdUp = useMediaQuery((theme: SaleorTheme) =>
    theme.breakpoints.up("md"),
  );
  const {
    availableChannels,
    channel,
    isPickerActive,
    setChannel,
  } = useAppChannel(false);

  const [menuStructure, handleMenuItemClick] = useMenuStructure(intl, user);
  const activeMenu = menuStructure.find(menuItem =>
    isMenuActive(location.pathname, menuItem),
  )?.id;

  const toggleTheme = () => setTheme(isDarkTheme(themeType) ? "light" : "dark");

  return (
    <>
      <Navigator
        visible={isNavigatorVisible}
        setVisibility={setNavigatorVisibility}
      />
      <div className={classes.root}>
        {isMdUp && (
          <Sidebar
            activeId={activeMenu}
            menuItems={menuStructure}
            onMenuItemClick={handleMenuItemClick}
            logoHref="/"
            linkComponent={SidebarLink}
          />
        )}
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
                    {!isMdUp && (
                      <SidebarDrawer
                        menuItems={menuStructure}
                        logoHref="/"
                        onMenuItemClick={handleMenuItemClick}
                        linkComponent={SidebarLink}
                      />
                    )}
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
