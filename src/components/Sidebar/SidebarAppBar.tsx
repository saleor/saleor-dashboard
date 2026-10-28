import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { sectionNames } from "@dashboard/intl";
import { globalSearchUrl } from "@dashboard/search/urls";
import { Avatar, Drawer, Text } from "@saleor/macaw-ui-next";
import { Menu, Search } from "lucide-react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import styles from "./SidebarAppBar.module.css";
import { sidebarDrawerTriggerMessages } from "./sidebarDrawerTriggerMessages";

// Centred in a 44px target, a 20px icon lands on the 12px inset of phone page headers.
const appBarIconProps = {
  size: iconSize.medium,
  strokeWidth: iconStrokeWidthBySize.medium,
} as const;

interface SidebarAppBarProps {
  logo: string;
  canSearch: boolean;
  onMenuOpen?: () => void;
}

/** Phone-width header: the navigation opens in the drawer, search stays one tap away. */
export const SidebarAppBar = ({ logo, canSearch, onMenuOpen }: SidebarAppBarProps) => {
  const intl = useIntl();

  return (
    <header className={styles.appBar} data-test-id="sidebar-app-bar">
      <Drawer.Trigger>
        <button
          type="button"
          className={styles.iconButton}
          aria-label={intl.formatMessage(sidebarDrawerTriggerMessages.openNavigation)}
          data-test-id="sidebar-drawer-open"
          onClick={onMenuOpen}
        >
          <Menu {...appBarIconProps} aria-hidden />
        </button>
      </Drawer.Trigger>
      <div className={styles.brand}>
        <Avatar.Store src={logo} scheme="accent1" size="small" />
        <Text size={3} fontWeight="bold" className="ellipsis">
          Saleor Dashboard
        </Text>
      </div>
      {canSearch && (
        <Link
          to={globalSearchUrl()}
          className={styles.iconButton}
          aria-label={intl.formatMessage(sectionNames.search)}
          data-test-id="sidebar-app-bar-search"
        >
          <Search {...appBarIconProps} aria-hidden />
        </Link>
      )}
    </header>
  );
};
