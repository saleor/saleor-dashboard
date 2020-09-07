import logoLight from "@assets/images/logo-sidebar-light.svg";
import configurationIcon from "@assets/images/menu-configure-icon.svg";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { configurationMenuUrl } from "@saleor/configuration";
import { User } from "@saleor/fragments/types/User";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import { sectionNames } from "@saleor/intl";
import React from "react";
import SVG from "react-inlinesvg";
import { useIntl } from "react-intl";

import { IMenuItem } from "../AppLayout/menuStructure";
import MenuItem from "./MenuItem";
import { isMenuActive } from "./utils";

const useStyles = makeStyles(
  theme => ({
    logo: {
      margin: `36px 0 ${theme.spacing(3)}px 19px`
    },
    root: {
      transition: "width 0.5s ease"
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
  onMenuItemClick: (url: string, event: React.MouseEvent) => void;
}

export interface IActiveSubMenu {
  isActive: boolean;
  label: string | null;
}

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

  return (
    <div className={classes.root}>
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
          menuItem={{
            ariaLabel: "configure",
            icon: configurationIcon,
            label: intl.formatMessage(sectionNames.configuration),
            testingContextId: "configure",
            url: configurationMenuUrl
          }}
          onClick={onMenuItemClick}
        />
      )}
      <button onClick={() => setShrink(!isShrunk)}>toggl</button>
    </div>
  );
};

SideBar.displayName = "SideBar";
export default SideBar;
