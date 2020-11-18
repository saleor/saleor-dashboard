import logoLight from "@assets/images/logo-sidebar-light.svg";
import { Typography } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import MenuIcon from "@material-ui/icons/Menu";
import classNames from "classnames";
import React from "react";
import SVG from "react-inlinesvg";
import { useIntl } from "react-intl";

import { IMenuItem } from "../AppLayout/menuStructure";
import { getConfigureMenuItem, SideBarProps } from "../SideBar/SideBar";
import SquareButton from "../SquareButton";
import MenuItemBtn from "./MenuItemBtn";
import useStyles from "./styles";

export type SideBarDrawerProps = SideBarProps;

const SideBarDrawer: React.FC<SideBarDrawerProps> = ({
  menuItems,
  onMenuItemClick,
  renderConfigure,
  user
}) => {
  const [isOpened, setOpened] = React.useState(false);
  const classes = useStyles({});
  const intl = useIntl();
  const [activeMenu, setActiveMenu] = React.useState<IMenuItem>(null);
  const [showSubmenu, setShowSubmenu] = React.useState(false);
  const container = React.useRef<HTMLDivElement>(null);

  const configureMenuItem = getConfigureMenuItem(intl);

  const handleMenuItemClick = (url: string) => {
    setOpened(false);
    setShowSubmenu(false);
    onMenuItemClick(url);
  };

  const handleMenuItemWithChildrenClick = (menuItem: IMenuItem) => {
    setActiveMenu(menuItem);
    setShowSubmenu(true);
    container.current.scrollTo({
      top: 0
    });
  };

  return (
    <>
      <SquareButton onClick={() => setOpened(true)}>
        <MenuIcon />
      </SquareButton>
      <Drawer
        classes={{
          paper: classes.root
        }}
        open={isOpened}
        onClose={() => setOpened(false)}
      >
        <div
          className={classNames(classes.container, {
            [classes.containerSubMenu]: showSubmenu
          })}
          ref={container}
        >
          <div
            className={classNames(classes.innerContainer, {
              [classes.secondaryContentActive]: showSubmenu
            })}
          >
            <div className={classes.content}>
              <SVG className={classes.logo} src={logoLight} />
              {menuItems.map(menuItem => {
                if (
                  menuItem.permission &&
                  !user.userPermissions
                    .map(perm => perm.code)
                    .includes(menuItem.permission)
                ) {
                  return null;
                }

                return (
                  <MenuItemBtn
                    menuItem={menuItem}
                    onClick={
                      menuItem.children
                        ? () => handleMenuItemWithChildrenClick(menuItem)
                        : handleMenuItemClick
                    }
                    key={menuItem.ariaLabel}
                  />
                );
              })}
              {renderConfigure && (
                <MenuItemBtn
                  menuItem={configureMenuItem}
                  onClick={handleMenuItemClick}
                />
              )}
            </div>
            {activeMenu && (
              <div className={classes.content}>
                <div className={classes.subMenuTopBar}>
                  <div className={classes.activeMenuLabel}>
                    <SVG className={classes.icon} src={activeMenu.icon} />
                    <Typography className={classes.label}>
                      {activeMenu.label}
                    </Typography>
                  </div>
                  <SquareButton onClick={() => setShowSubmenu(false)}>
                    <ArrowLeftIcon />
                  </SquareButton>
                </div>
                {activeMenu.children.map(subMenuItem => (
                  <MenuItemBtn
                    menuItem={subMenuItem}
                    onClick={handleMenuItemClick}
                    key={subMenuItem.ariaLabel}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
};

SideBarDrawer.displayName = "SideBarDrawer";
export default SideBarDrawer;
