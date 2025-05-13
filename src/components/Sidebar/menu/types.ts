import { PermissionEnum } from "@dashboard/graphql";
import { Sprinkles } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

export interface SidebarMenuItem {
  label?: string | ReactNode;
  id: string;
  url?: string;
  matchUrls?: string[];
  permissions?: PermissionEnum[];
  type: "item" | "itemGroup" | "divider";
  icon?: ReactNode;
  onClick?: () => void;
  children?: SidebarMenuItem[];
  paddingY?: Sprinkles["paddingY"];
  endAdornment?: ReactNode;
}
