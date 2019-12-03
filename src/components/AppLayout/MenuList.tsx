import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage, useIntl } from "react-intl";
import { matchPath } from "react-router";

import configureIcon from "@assets/images/menu-configure-icon.svg";
import useTheme from "@saleor/hooks/useTheme";
import { sectionNames } from "@saleor/intl";
import { User } from "../../auth/types/User";
import {
  configurationMenuUrl,
  createConfigurationMenu
} from "../../configuration";
import { createHref } from "../../misc";
import { orderDraftListUrl, orderListUrl } from "../../orders/urls";
import MenuNested from "./MenuNested";
import { IMenuItem } from "./menuStructure";

const useStyles = makeStyles(
  theme => ({
    menuIcon: {
      "& svg": {
        height: 32,
        width: 32
      },
      display: "inline-block",
      position: "relative",
      top: 8
    },
    menuIconDark: {
      "& path": {
        fill: theme.palette.common.white
      }
    },
    menuIconSmall: {
      left: -5
    },
    menuIsActive: {
      boxShadow: "0px 0px 12px 1px rgba(0,0,0,0.2)"
    },
    menuItemHover: {
      "& p": {
        fontSize: 14,
        transition: "color 0.5s ease, opacity 0.3s ease-out"
      },
      "& path": {
        transition: "fill 0.5s ease"
      },
      "&:hover": {
        "& p": {
          color: theme.palette.primary.main
        },
        "& path": {
          fill: theme.palette.primary.main
        },
        "&:before": {
          borderLeft: `solid 2px ${theme.palette.primary.main}`,
          content: "''",
          height: 33,
          left: -20,
          position: "absolute",
          top: 8
        },
        color: theme.palette.primary.main
      },
      cursor: "pointer",
      position: "relative"
    },
    menuList: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      marginLeft: theme.spacing(4),
      marginTop: theme.spacing(2),
      paddingBottom: theme.spacing(3)
    },
    menuListItem: {
      alignItems: "center",
      display: "block",
      marginBottom: theme.spacing(5),
      paddingLeft: 0,
      textDecoration: "none",
      transition: theme.transitions.duration.standard + "ms"
    },
    menuListItemActive: {
      "& $menuListItemText": {
        color: theme.palette.primary.main
      },
      "& path": {
        color: theme.palette.primary.main,
        fill: theme.palette.primary.main
      }
    },
    menuListItemOpen: {
      "&:after": {
        borderBottom: `10px solid transparent`,
        borderLeft: `10px solid ${theme.palette.background.paper}`,
        borderTop: `10px solid transparent`,
        content: "''",
        height: 0,
        position: "absolute",
        right: -30,
        top: 15,
        width: 0
      },
      "&:before": {
        borderLeft: `solid 2px ${theme.palette.primary.main}`,
        content: "''",
        height: 33,
        left: -20,
        position: "absolute",
        top: 8
      },
      position: "relative"
    },
    menuListItemText: {
      "&:hover": {
        color: theme.palette.primary.main
      },
      bottom: 0,
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: 500,
      left: 30,
      opacity: 1,
      paddingLeft: 16,
      position: "absolute",
      textTransform: "uppercase",
      transition: "opacity 0.5s ease"
    },
    menuListItemTextHide: {
      bottom: 0,
      left: 30,
      opacity: 0,
      position: "absolute"
    },
    subMenu: {
      padding: "0 15px"
    },
    subMenuDrawer: {
      background: "#000",
      cursor: "pointer",
      height: "100vh",
      left: 0,
      opacity: 0.2,
      position: "absolute",
      top: 0,
      width: 0,
      zIndex: -2
    },
    subMenuDrawerOpen: {
      width: `100vw`
    }
  }),
  { name: "MenuList" }
);

interface MenuListProps {
  className?: string;
  menuItems: IMenuItem[];
  isMenuSmall: boolean;
  location: string;
  user: User;
  renderConfigure: boolean;
  onMenuItemClick: (url: string, event: React.MouseEvent<any>) => void;
}

export interface IActiveSubMenu {
  isActive: boolean;
  label: string | null;
}

const MenuList: React.FC<MenuListProps> = props => {
  const {
    className,
    menuItems,
    isMenuSmall,
    location,
    user,
    renderConfigure,
    onMenuItemClick
  } = props;

  const classes = useStyles(props);

  const { isDark } = useTheme();
  const [activeSubMenu, setActiveSubMenu] = React.useState<IActiveSubMenu>({
    isActive: false,
    label: null
  });
  const intl = useIntl();

  const configutationMenu = createConfigurationMenu(intl).map(menu => {
    menu.menuItems.map(item =>
      user.permissions.map(perm => perm.code).includes(item.permission)
    );
  });

  const handleSubMenu = itemLabel => {
    setActiveSubMenu({
      isActive:
        itemLabel === activeSubMenu.label ? !activeSubMenu.isActive : true,
      label: itemLabel
    });
  };

  const closeSubMenu = (menuItemUrl, event) => {
    setActiveSubMenu({
      isActive: false,
      label: null
    });
    if (menuItemUrl && event) {
      onMenuItemClick(menuItemUrl, event);
      event.stopPropagation();
      event.preventDefault();
    }
  };

  return (
    <div
      className={classNames(className, {
        [classes.menuIsActive]: activeSubMenu.isActive
      })}
    >
      {/* FIXME: this .split("?")[0] looks gross */}
      {menuItems.map(menuItem => {
        const isActive = (menuItem: IMenuItem) =>
          location.split("?")[0] === orderDraftListUrl().split("?")[0] &&
          menuItem.url.split("?")[0] === orderListUrl().split("?")[0]
            ? false
            : !!matchPath(location.split("?")[0], {
                exact: menuItem.url.split("?")[0] === "/",
                path: menuItem.url.split("?")[0]
              });

        if (
          menuItem.permission &&
          !user.permissions.map(perm => perm.code).includes(menuItem.permission)
        ) {
          return null;
        }

        if (!menuItem.url) {
          const isAnyChildActive = menuItem.children.reduce(
            (acc, child) => acc || isActive(child),
            false
          );

          return (
            <div
              className={classNames(classes.menuListItem, {
                [classes.menuListItemActive]: isAnyChildActive
              })}
              key={menuItem.label}
            >
              <div
                className={classNames(classes.menuItemHover, {
                  [classes.menuListItemOpen]:
                    menuItem.ariaLabel === activeSubMenu.label &&
                    activeSubMenu.isActive
                })}
                data-tc={menuItem.label}
                onClick={() => handleSubMenu(menuItem.ariaLabel)}
              >
                <SVG
                  className={classNames(classes.menuIcon, {
                    [classes.menuIconDark]: isDark,
                    [classes.menuIconSmall]: !isMenuSmall
                  })}
                  src={menuItem.icon}
                />
                <Typography
                  aria-label={menuItem.ariaLabel}
                  className={classNames(classes.menuListItemText, {
                    [classes.menuListItemTextHide]: !isMenuSmall
                  })}
                >
                  {menuItem.label}
                </Typography>
              </div>
              <MenuNested
                activeItem={activeSubMenu}
                closeSubMenu={setActiveSubMenu}
                menuItem={menuItem}
                onMenuItemClick={onMenuItemClick}
                handleSubMenu={handleSubMenu}
                title={menuItem.label}
                icon={menuItem.icon}
                ariaLabel={menuItem.ariaLabel}
              />
              <div
                onClick={event => closeSubMenu(null, event)}
                className={classNames(classes.subMenuDrawer, {
                  [classes.subMenuDrawerOpen]: activeSubMenu.isActive
                })}
              />
            </div>
          );
        }

        return (
          <a
            className={classNames(classes.menuListItem, {
              [classes.menuListItemActive]: isActive(menuItem)
            })}
            href={createHref(menuItem.url)}
            onClick={event => closeSubMenu(menuItem.url, event)}
            key={menuItem.label}
          >
            <div className={classes.menuItemHover}>
              <SVG
                className={classNames(classes.menuIcon, {
                  [classes.menuIconDark]: isDark,
                  [classes.menuIconSmall]: !isMenuSmall
                })}
                src={menuItem.icon}
              />
              <Typography
                aria-label={menuItem.ariaLabel}
                className={classNames(classes.menuListItemText, {
                  [classes.menuListItemTextHide]: !isMenuSmall
                })}
              >
                {menuItem.label}
              </Typography>
            </div>
          </a>
        );
      })}
      {renderConfigure && configutationMenu.length > 0 && (
        <a
          className={classes.menuListItem}
          href={createHref(configurationMenuUrl)}
          onClick={event => closeSubMenu(configurationMenuUrl, event)}
        >
          <div className={classes.menuItemHover}>
            <SVG
              className={classNames(classes.menuIcon, {
                [classes.menuIconDark]: isDark,
                [classes.menuIconSmall]: !isMenuSmall
              })}
              src={configureIcon}
            />
            <Typography
              aria-label="configuration"
              className={classNames(classes.menuListItemText, {
                [classes.menuListItemTextHide]: !isMenuSmall
              })}
            >
              <FormattedMessage {...sectionNames.configuration} />
            </Typography>
          </div>
        </a>
      )}
    </div>
  );
};

MenuList.displayName = "MenuList";
export default MenuList;
