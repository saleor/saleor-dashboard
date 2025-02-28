import { PermissionEnum } from "@dashboard/graphql";
import { IconProps } from "@material-ui/core";
import { ReactElement } from "react";

export interface MenuItem {
  description: string;
  icon: ReactElement<IconProps>;
  permissions?: PermissionEnum[];
  requireAllPermissions?: boolean;
  title: string;
  url?: string;
  testId?: string;
}

export interface MenuSection {
  label: string;
  menuItems: MenuItem[];
}
