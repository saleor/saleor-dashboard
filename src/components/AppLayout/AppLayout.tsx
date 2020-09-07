import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import LinearProgress from "@material-ui/core/LinearProgress";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import { createConfigurationMenu } from "@saleor/configuration";
import useAppState from "@saleor/hooks/useAppState";
import useNavigator from "@saleor/hooks/useNavigator";
import useTheme from "@saleor/hooks/useTheme";
import useUser from "@saleor/hooks/useUser";
import ArrowDropdown from "@saleor/icons/ArrowDropdown";
import { staffMemberDetailsUrl } from "@saleor/staff/urls";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import useRouter from "use-react-router";

import Container from "../Container";
import ErrorPage from "../ErrorPage";
import Navigator from "../Navigator";
import NavigatorButton from "../NavigatorButton/NavigatorButton";
import SideBar from "../SideBar";
import AppActionContext from "./AppActionContext";
import AppHeaderContext from "./AppHeaderContext";
import { appLoaderHeight } from "./consts";
import createMenuStructure from "./menuStructure";
import ThemeSwitch from "./ThemeSwitch";

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
    appLoader: {
      height: appLoaderHeight,
      marginBottom: theme.spacing(4),
      zIndex: 1201
    },
    appLoaderPlaceholder: {
      height: appLoaderHeight,
      marginBottom: theme.spacing(4)
    },
    arrow: {
      marginLeft: theme.spacing(2),
      transition: theme.transitions.duration.standard + "ms"
    },
    avatar: {
      "&&": {
        height: 32,
        width: 32
      }
    },
    content: {
      flex: 1
    },
    darkThemeSwitch: {
      [theme.breakpoints.down("sm")]: {
        marginRight: -theme.spacing(1.5)
      },
      marginRight: theme.spacing(2)
    },
    header: {
      [theme.breakpoints.down("sm")]: {
        height: 88,
        marginBottom: 0
      },
      display: "flex",
      height: 40,
      marginBottom: theme.spacing(3)
    },
    menu: {
      background: theme.palette.background.paper,
      height: "100vh",
      padding: "25px 20px"
    },
    menuIcon: {
      "& span": {
        "&:nth-child(1)": {
          top: 15
        },
        "&:nth-child(2), &:nth-child(3)": {
          top: 20
        },
        "&:nth-child(4)": {
          top: 25
        },
        background: theme.palette.secondary.light,
        display: "block",
        height: 1,
        left: "20%",
        opacity: 1,
        position: "absolute",
        transform: "rotate(0deg)",
        transition: ".25s ease-in-out",
        width: "60%"
      },
      [theme.breakpoints.up("md")]: {
        display: "none"
      },
      [theme.breakpoints.down("sm")]: {
        left: 0
      },
      background: theme.palette.background.paper,
      borderRadius: "50%",
      cursor: "pointer",
      height: 42,
      left: theme.spacing(),
      marginRight: theme.spacing(2),
      position: "relative",
      transform: "rotate(0deg)",
      transition: `${theme.transitions.duration.shorter}ms ease-in-out`,
      width: 42
    },
    menuIconDark: {
      "& span": {
        background: theme.palette.common.white
      }
    },
    menuIconOpen: {
      "& span": {
        "&:nth-child(1), &:nth-child(4)": {
          left: "50%",
          top: 20,
          width: 0
        },
        "&:nth-child(2)": {
          transform: "rotate(45deg)"
        },
        "&:nth-child(3)": {
          transform: "rotate(-45deg)"
        }
      },
      left: 280,
      position: "absolute",
      zIndex: 1999
    },
    menuSmall: {
      background: theme.palette.background.paper,
      height: "100vh",
      overflow: "hidden",
      padding: 25
    },
    popover: {
      zIndex: 1
    },
    root: {
      display: "flex",
      width: `100%`
    },
    rotate: {
      transform: "rotate(180deg)"
    },
    spacer: {
      flex: 1
    },
    userBar: {
      [theme.breakpoints.down("sm")]: {
        alignItems: "flex-end",
        flexDirection: "column-reverse",
        overflow: "hidden"
      },
      alignItems: "center",
      display: "flex"
    },
    userChip: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: 24,
      color: theme.palette.text.primary,
      height: 40,
      padding: theme.spacing(0.5)
    },
    userMenuContainer: {
      position: "relative"
    },
    userMenuItem: {
      textAlign: "right"
    },
    view: {
      flex: 1,
      flexGrow: 1,
      marginLeft: 0,
      paddingBottom: theme.spacing(),
      [theme.breakpoints.up("sm")]: {
        paddingBottom: theme.spacing(3)
      }
    },
    viewContainer: {
      minHeight: `calc(100vh - ${theme.spacing(4) + appLoaderHeight + 120}px)`
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
  const { isDark, toggleTheme } = useTheme();
  const [isDrawerOpened, setDrawerState] = React.useState(false);
  const [isMenuOpened, setMenuState] = React.useState(false);
  const appActionAnchor = React.useRef<HTMLDivElement>();
  const appHeaderAnchor = React.useRef<HTMLDivElement>();
  const anchor = React.useRef<HTMLDivElement>();
  const { logout, user } = useUser();
  const navigate = useNavigator();
  const intl = useIntl();
  const [appState, dispatchAppState] = useAppState();
  const { location } = useRouter();
  const [isNavigatorVisible, setNavigatorVisibility] = React.useState(false);

  const menuStructure = createMenuStructure(intl);
  const configurationMenu = createConfigurationMenu(intl);
  const userPermissions = user?.userPermissions || [];

  const renderConfigure = configurationMenu.some(section =>
    section.menuItems.some(
      menuItem =>
        !!userPermissions.find(
          userPermission => userPermission.code === menuItem.permission
        )
    )
  );

  const handleLogout = () => {
    setMenuState(false);
    logout();
  };

  const handleViewerProfile = () => {
    setMenuState(false);
    navigate(staffMemberDetailsUrl(user.id));
  };

  const handleMenuItemClick = (url: string, event: React.MouseEvent<any>) => {
    event.stopPropagation();
    event.preventDefault();
    setDrawerState(false);
    navigate(url);
  };

  const handleErrorBack = () => {
    navigate("/");
    dispatchAppState({
      payload: {
        error: null
      },
      type: "displayError"
    });
  };

  return (
    <>
      <Navigator
        visible={isNavigatorVisible}
        setVisibility={setNavigatorVisibility}
      />
      <AppHeaderContext.Provider value={appHeaderAnchor}>
        <AppActionContext.Provider value={appActionAnchor}>
          <div className={classes.root}>
            <SideBar
              menuItems={menuStructure}
              location={location.pathname}
              user={user}
              renderConfigure={renderConfigure}
              onMenuItemClick={handleMenuItemClick}
            />
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
                      <div
                        className={classNames(classes.menuIcon, {
                          [classes.menuIconOpen]: isDrawerOpened,
                          [classes.menuIconDark]: isDark
                        })}
                        onClick={() => setDrawerState(!isDrawerOpened)}
                      >
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>
                      <div ref={appHeaderAnchor} />
                      <div className={classes.spacer} />
                      <div className={classes.userBar}>
                        <ThemeSwitch
                          className={classes.darkThemeSwitch}
                          checked={isDark}
                          onClick={toggleTheme}
                        />
                        <NavigatorButton
                          isMac={navigator.platform
                            .toLowerCase()
                            .includes("mac")}
                          onClick={() => setNavigatorVisibility(true)}
                        />
                        <div className={classes.userMenuContainer} ref={anchor}>
                          <Chip
                            avatar={
                              user.avatar && (
                                <Avatar alt="user" src={user.avatar.url} />
                              )
                            }
                            classes={{
                              avatar: classes.avatar
                            }}
                            className={classes.userChip}
                            label={
                              <>
                                {user.email}
                                <ArrowDropdown
                                  className={classNames(classes.arrow, {
                                    [classes.rotate]: isMenuOpened
                                  })}
                                />
                              </>
                            }
                            onClick={() => setMenuState(!isMenuOpened)}
                            data-test="userMenu"
                          />
                          <Popper
                            className={classes.popover}
                            open={isMenuOpened}
                            anchorEl={anchor.current}
                            transition
                            placement="bottom-end"
                          >
                            {({ TransitionProps, placement }) => (
                              <Grow
                                {...TransitionProps}
                                style={{
                                  transformOrigin:
                                    placement === "bottom"
                                      ? "right top"
                                      : "right bottom"
                                }}
                              >
                                <Paper>
                                  <ClickAwayListener
                                    onClickAway={() => setMenuState(false)}
                                    mouseEvent="onClick"
                                  >
                                    <Menu>
                                      <MenuItem
                                        className={classes.userMenuItem}
                                        onClick={handleViewerProfile}
                                        data-test="accountSettingsButton"
                                      >
                                        <FormattedMessage
                                          defaultMessage="Account Settings"
                                          description="button"
                                        />
                                      </MenuItem>
                                      <MenuItem
                                        className={classes.userMenuItem}
                                        onClick={handleLogout}
                                        data-test="logOutButton"
                                      >
                                        <FormattedMessage
                                          defaultMessage="Log out"
                                          description="button"
                                        />
                                      </MenuItem>
                                    </Menu>
                                  </ClickAwayListener>
                                </Paper>
                              </Grow>
                            )}
                          </Popper>
                        </div>
                      </div>
                    </div>
                  </Container>
                </div>
                <main className={classes.view}>
                  {appState.error
                    ? appState.error === "unhandled" && (
                        <ErrorPage onBack={handleErrorBack} />
                      )
                    : children}
                </main>
              </div>
              <div className={classes.appAction} ref={appActionAnchor} />
            </div>
          </div>
        </AppActionContext.Provider>
      </AppHeaderContext.Provider>
    </>
  );
};

export default AppLayout;
