import logoLight from "@assets/images/logo-sidebar-light.svg";
import configurationIcon from "@assets/images/menu-configure-icon.svg";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { configurationMenuUrl } from "@saleor/configuration";
import { User } from "@saleor/fragments/types/User";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import { UseNavigatorResult } from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import classNames from "classnames";
import React from "react";
import SVG from "react-inlinesvg";
import { IntlShape, useIntl } from "react-intl";

import { IMenuItem } from "../AppLayout/menuStructure";
import ExpandButton from "./ExpandButton";
import MenuItem, { menuWidth, shrunkMenuWidth } from "./MenuItem";
import { isMenuActive } from "./utils";

const useStyles = makeStyles(
  theme => ({
    expandButton: {
      marginLeft: theme.spacing(2)
    },
    float: {
      position: "fixed"
    },
    logo: {
      margin: `36px 0 ${theme.spacing(3)}px ${theme.spacing(3)}px`
    },
    root: {
      transition: "width 0.5s ease",
      width: menuWidth,
      zIndex: 100
    },
    rootShrink: {
      width: shrunkMenuWidth
    }
  }),
  {
    name: "SideBar"
  }
);

export interface SideBarProps {
  className?: string;
  menuItems: IMenuItem[];
  location: string;
  user: User;
  renderConfigure: boolean;
  onMenuItemClick: UseNavigatorResult;
}

export interface IActiveSubMenu {
  isActive: boolean;
  label: string | null;
}

export const getConfigureMenuItem = (intl: IntlShape): IMenuItem => ({
  ariaLabel: "configure",
  icon: configurationIcon,
  label: intl.formatMessage(sectionNames.configuration),
  testingContextId: "configure",
  url: configurationMenuUrl
});

const SideBar: React.FC<SideBarProps> = ({
  location,
  menuItems,
  renderConfigure,
  user,
  onMenuItemClick
}) => {
  const classes = useStyles({});
  const [isShrunk, setShrink] = useLocalStorage("isMenuSmall", false);
  const intl = useIntl();
  const configureMenuItem = getConfigureMenuItem(intl);

  return (
    <div
      className={classNames(classes.root, {
        [classes.rootShrink]: isShrunk
      })}
    >
      <div className={classes.float}>
        <div className={classes.logo}>
          <SVG src={logoLight} />
        </div>
        {menuItems.map(menuItem => {
          const isActive = isMenuActive(location, menuItem);

          if (
            menuItem.permission &&
            !user.userPermissions
              .map(perm => perm.code)
              .includes(menuItem.permission)
          ) {
            return null;
          }

          return (
            <MenuItem
              active={isActive}
              isMenuShrunk={isShrunk}
              menuItem={menuItem}
              onClick={onMenuItemClick}
              key={menuItem.ariaLabel}
            />
          );
        })}
        {renderConfigure && (
          <MenuItem
            active={
              !menuItems.reduce(
                (acc, menuItem) => acc || isMenuActive(location, menuItem),
                false
              )
            }
            isMenuShrunk={isShrunk}
            menuItem={configureMenuItem}
            onClick={onMenuItemClick}
          />
        )}
        <ExpandButton
          className={classes.expandButton}
          isShrunk={isShrunk}
          onClick={() => setShrink(!isShrunk)}
        />
      </div>
    </div>
  );
};

SideBar.displayName = "SideBar";
export default SideBar;
