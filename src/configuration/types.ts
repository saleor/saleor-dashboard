import { PermissionEnum } from "@dashboard/graphql";
import { IconProps } from "@material-ui/core";

export interface MenuItem {
  description: string;
  icon: React.ReactElement<IconProps>;
  permissions?: PermissionEnum[];
  requireAllPermissions?: boolean;
  title: string;
  url?: string;
  testId?: string;
  hidden?: boolean;
}

export interface MenuSection {
  label: string;
  menuItems: MenuItem[];
}
