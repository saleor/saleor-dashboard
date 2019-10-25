import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Hidden from "@material-ui/core/Hidden";
import LinearProgress from "@material-ui/core/LinearProgress";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import classNames from "classnames";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage, useIntl } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";

import saleorDarkLogoSmall from "@assets/images/logo-dark-small.svg";
import saleorDarkLogo from "@assets/images/logo-dark.svg";
import menuArrowIcon from "@assets/images/menu-arrow-icon.svg";
import AppProgressProvider from "@saleor/components/AppProgress";
import { createConfigurationMenu } from "@saleor/configuration";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import useNavigator from "@saleor/hooks/useNavigator";
import useTheme from "@saleor/hooks/useTheme";
import useUser from "@saleor/hooks/useUser";
import ArrowDropdown from "@saleor/icons/ArrowDropdown";
import { maybe } from "@saleor/misc";
import { staffMemberDetailsUrl } from "@saleor/staff/urls";
import Container from "../Container";
import AppActionContext from "./AppActionContext";
import AppHeaderContext from "./AppHeaderContext";
import { appLoaderHeight, drawerWidth, drawerWidthExpanded } from "./consts";
import MenuList from "./MenuList";
import createMenuStructure from "./menuStructure";
import ResponsiveDrawer from "./ResponsiveDrawer";
import ThemeSwitch from "./ThemeSwitch";

const styles = (theme: Theme) =>
  createStyles({
    appAction: {
      [theme.breakpoints.down("sm")]: {
        left: 0,
        width: "100%"
      },
      bottom: 0,
      gridColumn: 2,
      height: 70,
      position: "sticky",
      zIndex: 10
    },
    appLoader: {
      height: appLoaderHeight,
      marginBottom: theme.spacing.unit * 2,
      zIndex: 1201
    },
    appLoaderPlaceholder: {
      height: appLoaderHeight,
      marginBottom: theme.spacing.unit * 2
    },
    arrow: {
      marginLeft: theme.spacing.unit * 2,
      transition: theme.transitions.duration.standard + "ms"
    },
    content: {
      [theme.breakpoints.down("sm")]: {
        paddingLeft: 0
      },
      paddingLeft: drawerWidthExpanded,
      transition: "padding-left 0.5s ease",
      width: "100%"
    },
    contentToggle: {
      [theme.breakpoints.down("sm")]: {
        paddingLeft: 0
      },
      paddingLeft: drawerWidth
    },
    darkThemeSwitch: {
      marginRight: theme.spacing.unit * 2
    },
    header: {
      display: "flex",
      height: 40,
      marginBottom: theme.spacing.unit * 3
    },
    isMenuSmall: {
      "& path": {
        fill: theme.palette.primary.main
      },
      "& span": {
        margin: "0 8px"
      },
      "& svg": {
        marginTop: 8,
        transform: "rotate(180deg)"
      },
      "&:hover": {
        background: "#E6F3F3"
      },
      background: theme.palette.background.paper,
      border: `solid 1px #EAEAEA`,
      borderRadius: "50%",
      cursor: "pointer",
      height: 32,
      position: "absolute",
      right: -16,
      top: 65,
      transition: `background ${theme.transitions.duration.shorter}ms`,
      width: 32,
      zIndex: 99
    },
    isMenuSmallDark: {
      "&:hover": {
        background: `linear-gradient(0deg, rgba(25, 195, 190, 0.1), rgba(25, 195, 190, 0.1)), ${theme.palette.background.paper}`
      },
      border: `solid 1px #252728`,
      transition: `background  ${theme.transitions.duration.shorter}ms`
    },
    isMenuSmallHide: {
      "& svg": {
        marginLeft: "3px",
        transform: "rotate(0deg)"
      }
    },
    logo: {
      "& svg": {
        left: "50%",
        position: "absolute",
        top: "50%",
        transform: "translate(-50%,-50%)"
      },
      background: theme.palette.secondary.main,
      display: "block",
      height: 80,
      position: "relative"
    },
    logoDark: {
      "& path": {
        fill: theme.palette.common.white
      },
      background: theme.palette.primary.main
    },
    logoSmall: {
      "& svg": {
        margin: 0,
        padding: 0,
        width: "80px"
      }
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
      background: theme.palette.background.paper,
      borderRadius: "50%",
      cursor: "pointer",
      height: 42,
      left: theme.spacing.unit,
      marginRight: theme.spacing.unit * 2,
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
      width: `100%`
    },
    rotate: {
      transform: "rotate(180deg)"
    },
    sideBar: {
      [theme.breakpoints.down("sm")]: {
        padding: 0
      },
      background: theme.palette.background.paper,
      padding: `0 ${theme.spacing.unit * 4}px`
    },
    spacer: {
      flex: 1
    },
    userBar: {
      alignItems: "center",
      display: "flex"
    },
    userChip: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary
    },
    userMenuContainer: {
      position: "relative"
    },
    userMenuItem: {
      textAlign: "right"
    },
    view: {
      backgroundColor: theme.palette.background.default,
      flex: 1,
      flexGrow: 1,
      marginLeft: 0,
      paddingBottom: theme.spacing.unit,
      [theme.breakpoints.up("sm")]: {
        paddingBottom: theme.spacing.unit * 3
      }
    },
    viewContainer: {
      minHeight: `calc(100vh - ${theme.spacing.unit * 2 +
        appLoaderHeight +
        70}px)`
    }
  });

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = withStyles(styles, {
  name: "AppLayout"
})(
  withRouter<AppLayoutProps & RouteComponentProps<any>, any>(
    ({
      classes,
      children,
      location
    }: AppLayoutProps &
      WithStyles<typeof styles> &
      RouteComponentProps<any>) => {
      const { isDark, toggleTheme } = useTheme();
      const [isMenuSmall, setMenuSmall] = useLocalStorage("isMenuSmall", false);
      const [isDrawerOpened, setDrawerState] = React.useState(false);
      const [isMenuOpened, setMenuState] = React.useState(false);
      const appActionAnchor = React.useRef<HTMLDivElement>();
      const appHeaderAnchor = React.useRef<HTMLDivElement>();
      const anchor = React.useRef<HTMLDivElement>();
      const { logout, user } = useUser();
      const navigate = useNavigator();
      const intl = useIntl();

      const menuStructure = createMenuStructure(intl);
      const configurationMenu = createConfigurationMenu(intl);
      const userPermissions = maybe(() => user.permissions, []);

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

      const handleMenuItemClick = (
        url: string,
        event: React.MouseEvent<any>
      ) => {
        event.stopPropagation();
        event.preventDefault();
        setDrawerState(false);
        navigate(url);
      };

      const handleIsMenuSmall = () => {
        setMenuSmall(!isMenuSmall);
      };

      return (
        <AppProgressProvider>
          {({ isProgress }) => (
            <AppHeaderContext.Provider value={appHeaderAnchor}>
              <AppActionContext.Provider value={appActionAnchor}>
                <div className={classes.root}>
                  <div className={classes.sideBar}>
                    <ResponsiveDrawer
                      onClose={() => setDrawerState(false)}
                      open={isDrawerOpened}
                      small={!isMenuSmall}
                    >
                      <div
                        className={classNames(classes.logo, {
                          [classes.logoSmall]: isMenuSmall,
                          [classes.logoDark]: isDark
                        })}
                      >
                        <SVG
                          src={
                            isMenuSmall ? saleorDarkLogoSmall : saleorDarkLogo
                          }
                        />
                      </div>
                      <Hidden smDown>
                        <div
                          className={classNames(classes.isMenuSmall, {
                            [classes.isMenuSmallHide]: isMenuSmall,
                            [classes.isMenuSmallDark]: isDark
                          })}
                          onClick={handleIsMenuSmall}
                        >
                          <SVG src={menuArrowIcon} />
                        </div>
                      </Hidden>
                      <MenuList
                        className={
                          isMenuSmall ? classes.menuSmall : classes.menu
                        }
                        menuItems={menuStructure}
                        isMenuSmall={!isMenuSmall}
                        location={location.pathname}
                        user={user}
                        renderConfigure={renderConfigure}
                        onMenuItemClick={handleMenuItemClick}
                      />
                    </ResponsiveDrawer>
                  </div>
                  <div
                    className={classNames(classes.content, {
                      [classes.contentToggle]: isMenuSmall
                    })}
                  >
                    {isProgress ? (
                      <LinearProgress
                        className={classes.appLoader}
                        color="primary"
                      />
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
                              <div
                                className={classes.userMenuContainer}
                                ref={anchor}
                              >
                                <Chip
                                  avatar={
                                    user.avatar && (
                                      <Avatar
                                        alt="user"
                                        src={user.avatar.url}
                                      />
                                    )
                                  }
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
                                />
                                <Popper
                                  className={classes.popover}
                                  open={isMenuOpened}
                                  anchorEl={anchor.current}
                                  transition
                                  disablePortal
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
                                          onClickAway={() =>
                                            setMenuState(false)
                                          }
                                          mouseEvent="onClick"
                                        >
                                          <Menu>
                                            <MenuItem
                                              className={classes.userMenuItem}
                                              onClick={handleViewerProfile}
                                            >
                                              <FormattedMessage
                                                defaultMessage="Account Settings"
                                                description="button"
                                              />
                                            </MenuItem>
                                            <MenuItem
                                              className={classes.userMenuItem}
                                              onClick={handleLogout}
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
                      <main className={classes.view}>{children}</main>
                    </div>
                    <div className={classes.appAction} ref={appActionAnchor} />
                  </div>
                </div>
              </AppActionContext.Provider>
            </AppHeaderContext.Provider>
          )}
        </AppProgressProvider>
      );
    }
  )
);

export default AppLayout;
