import { type PermissionEnum } from "@dashboard/graphql";
import { type Ripple } from "@dashboard/ripples/types";
import { type IconProps } from "@material-ui/core";

export interface MenuItem {
  description: string;
  icon: React.ReactElement<IconProps>;
  permissions?: PermissionEnum[];
  requireAllPermissions?: boolean;
  title: string;
  url?: string;
  testId?: string;
  hidden?: boolean;
  /** "What's new" hint shown on the tile until dismissed or expired. */
  ripple?: Ripple;
}

export interface MenuSection {
  label: string;
  menuItems: MenuItem[];
}
