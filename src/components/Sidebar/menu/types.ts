import { PermissionEnum } from "@dashboard/graphql";

export interface SidebarMenuItem {
  label?: string;
  id: string;
  url?: string;
  permissions?: PermissionEnum[];
  type: "item" | "itemGroup" | "divider";
  icon?: React.ReactNode;
  onClick?: () => void;
  children?: SidebarMenuItem[];
}
