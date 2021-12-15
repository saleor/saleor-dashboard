import { LinearProgress, useMediaQuery } from "@material-ui/core";
import { useUser } from "@saleor/auth";
import useAppState from "@saleor/hooks/useAppState";
import useNavigator from "@saleor/hooks/useNavigator";
import {
  makeStyles,
  SaleorTheme,
  Sidebar,
  SidebarDrawer,
  useActionBar,
  useBacklink,
  useTheme
} from "@saleor/macaw-ui";
import { staffMemberDetailsUrl } from "@saleor/staff/urls";
import classNames from "classnames";
import React from "react";
import { useIntl } from "react-intl";
import useRouter from "use-react-router";

import Container from "../Container";
import ErrorPage from "../ErrorPage";
import Navigator from "../Navigator";
import NavigatorButton from "../NavigatorButton/NavigatorButton";
import UserChip from "../UserChip";
import useAppChannel from "./AppChannelContext";
import AppChannelSelect from "./AppChannelSelect";
import { appLoaderHeight } from "./consts";
import createMenuStructure from "./menuStructure";
import { isMenuActive } from "./utils";

const useStyles = makeStyles(
  theme => ({
    appAction: {
      [theme.breakpoints.down("sm")]: {
        left: 0,
        width: "100%"
      },
      bottom: 0,
      gridColumn: 2,
      position: "sticky",
      zIndex: 10
    },
    appActionDocked: {
      position: "static"
    },
    appLoader: {
      height: appLoaderHeight,
      marginBottom: theme.spacing(4),
      zIndex: 1201
    },
    appLoaderPlaceholder: {
      height: appLoaderHeight,
      marginBottom: theme.spacing(4)
    },

    content: {
      flex: 1,
      [theme.breakpoints.up("md")]: {
        width: 0 // workaround for flex children width expansion affected by their contents
      }
    },
    darkThemeSwitch: {
      [theme.breakpoints.down("sm")]: {
        marginRight: theme.spacing(1)
      },
      marginRight: theme.spacing(2)
    },
    header: {
      display: "grid",
      gridTemplateAreas: `"headerAnchor headerToolbar"`,
      [theme.breakpoints.down("sm")]: {
        gridTemplateAreas: `"headerToolbar" 
        "headerAnchor"`
      },
      marginBottom: theme.spacing(3)
    },
    headerAnchor: {
      gridArea: "headerAnchor"
    },
    headerToolbar: {
      display: "flex",
      gridArea: "headerToolbar",
      height: 40,
      [theme.breakpoints.down("sm")]: {
        height: "auto"
      }
    },
    root: {
      [theme.breakpoints.up("md")]: {
        display: "flex"
      },
      width: `100%`
    },
    spacer: {
      flex: 1
    },
    userBar: {
      alignItems: "center",
      display: "flex"
    },

    view: {
      marginLeft: 0,
      paddingBottom: theme.spacing(),
      [theme.breakpoints.up("sm")]: {
        paddingBottom: theme.spacing(3)
      }
    },
    viewContainer: {
      minHeight: `calc(100vh + ${appLoaderHeight + 70}px - ${theme.spacing(2)})`
    }
  }),
  {
    name: "AppLayout"
  }
);

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const classes = useStyles({});
  const { themeType, setTheme } = useTheme();
  const { anchor: appActionAnchor, docked } = useActionBar();
  const appHeaderAnchor = useBacklink();
  const { logout, user } = useUser();
  const navigate = useNavigator();
  const intl = useIntl();
  const [appState, dispatchAppState] = useAppState();
  const { location } = useRouter();
  const [isNavigatorVisible, setNavigatorVisibility] = React.useState(false);
  const isMdUp = useMediaQuery((theme: SaleorTheme) =>
    theme.breakpoints.up("md")
  );
  const {
    availableChannels,
    channel,
    isPickerActive,
    setChannel
  } = useAppChannel(false);

  const menuStructure = createMenuStructure(intl, user);
  const activeMenu = menuStructure.find(menuItem =>
    isMenuActive(location.pathname, menuItem)
  )?.id;

  const handleErrorBack = () => {
    navigate("/");
    dispatchAppState({
      payload: {
        error: null
      },
      type: "displayError"
    });
  };

  const isDark = themeType === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

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
            onMenuItemClick={navigate}
          />
        )}
        <div className={classes.content}>
          {appState.loading ? (
            <LinearProgress className={classes.appLoader} color="primary" />
          ) : (
            <div className={classes.appLoaderPlaceholder} />
          )}
          <div className={classes.viewContainer}>
            <div>
              <Container>
                <div className={classes.header}>
                  <div className={classes.headerAnchor} ref={appHeaderAnchor} />
                  <div className={classes.headerToolbar}>
                    {!isMdUp && (
                      <SidebarDrawer
                        menuItems={menuStructure}
                        onMenuItemClick={navigate}
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
                        isDarkThemeEnabled={isDark}
                        user={user}
                        onLogout={logout}
                        onProfileClick={() =>
                          navigate(staffMemberDetailsUrl(user?.id))
                        }
                        onThemeToggle={toggleTheme}
                      />
                    </div>
                  </div>
                </div>
              </Container>
            </div>
            <main className={classes.view}>
              {appState.error
                ? appState.error.type === "unhandled" && (
                    <ErrorPage
                      id={appState.error.id}
                      onBack={handleErrorBack}
                      onRefresh={() => window.location.reload()}
                    />
                  )
                : children}
            </main>
          </div>
          <div
            className={classNames(classes.appAction, {
              [classes.appActionDocked]: docked
            })}
            ref={appActionAnchor}
          />
        </div>
      </div>
    </>
  );
};

export default AppLayout;
