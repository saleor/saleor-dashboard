import { IconProps } from "@material-ui/core";
import { PermissionEnum } from "@saleor/graphql";

export interface MenuItem {
  description: string;
  icon: React.ReactElement<IconProps>;
  permissions?: PermissionEnum[];
  title: string;
  url?: string;
  testId?: string;
}

export interface MenuSection {
  label: string;
  menuItems: MenuItem[];
}
