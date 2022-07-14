import { makeStyles, useTheme } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";

import { Logo } from "../SidebarDrawer/Logo";
import { LogoDark } from "../SidebarDrawer/LogoDark";
import { ExpandButton } from "./ExpandButton";
import { localStorageKeys } from "./localStorageKeys";
import { MenuItem, menuWidth, shrunkMenuWidth } from "./MenuItem";
import { BaseSidebarProps } from "./types";
import useLocalStorage from "./useLocalStorage";

const useStyles = makeStyles(
  theme => ({
    expandButton: {
      marginLeft: theme.spacing(1.5)
    },
    float: {
      height: "100vh",
      position: "fixed",
      overflowY: "auto",
      overflowX: "hidden",
      paddingBottom: theme.spacing(3)
    },
    logo: {
      display: "block",
      margin: `36px 0 ${theme.spacing(3)} ${theme.spacing(2.5)}`,
      color: "inherit"
    },
    root: {
      transition: "width 0.5s ease",
      width: menuWidth
    },
    rootShrink: {
      width: shrunkMenuWidth
    },
    toolbarContainer: {
      margin: theme.spacing(1, 0, 1, 1.5)
    }
  }),
  {
    name: "SideBar"
  }
);

export interface SidebarProps extends BaseSidebarProps {
  activeId: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeId,
  menuItems,
  toolbar,
  onMenuItemClick,
  logoHref,
  linkComponent
}) => {
  const classes = useStyles({});
  const { value: isShrunkStr, setValue: setShrink } = useLocalStorage(
    localStorageKeys.menuShrink,
    false.toString()
  );
  const isShrunk = isShrunkStr === "true";
  const { themeType } = useTheme();

  const Link = linkComponent ?? "a";

  return (
    <div
      className={clsx(classes.root, {
        [classes.rootShrink]: isShrunk
      })}
    >
      <div className={classes.float}>
        <Link href={logoHref} className={classes.logo}>
          {themeType === "dark" ? <LogoDark /> : <Logo />}
        </Link>
        {menuItems.map(menuItem =>
          linkComponent ? (
            <MenuItem
              activeId={activeId}
              isMenuShrunk={isShrunk}
              menuItem={menuItem}
              key={menuItem.ariaLabel}
              linkComponent={linkComponent}
            />
          ) : (
            <MenuItem
              activeId={activeId}
              isMenuShrunk={isShrunk}
              menuItem={menuItem}
              onClick={onMenuItemClick}
              key={menuItem.ariaLabel}
            />
          )
        )}
        {toolbar && <div className={classes.toolbarContainer}>{toolbar}</div>}
        <ExpandButton
          className={classes.expandButton}
          isShrunk={isShrunk}
          onClick={() => setShrink((!isShrunk).toString())}
        />
      </div>
    </div>
  );
};

Sidebar.displayName = "SideBar";
