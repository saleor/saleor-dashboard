import { type PermissionEnum } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import { Settings } from "lucide-react";

import { type SidebarMenuItem } from "./types";

export function showSubmenuSeparator(child: SidebarMenuItem, index: number): boolean {
  return Boolean(child.separatorBefore) && index > 0;
}

export function createSettingsSubmenuItem({
  id,
  label,
  url,
  permissions,
  separatorBefore = true,
  matchSearch,
}: {
  id: string;
  label: string;
  url: string;
  permissions: PermissionEnum[];
  separatorBefore?: boolean;
  matchSearch?: string | string[];
}): SidebarMenuItem {
  return {
    icon: renderSubmenuSettingsIcon(),
    label,
    labelStyle: "settings",
    id,
    url,
    permissions,
    type: "item",
    separatorBefore,
    matchSearch,
  };
}

function renderSubmenuSettingsIcon() {
  return (
    <Box
      color="default2"
      display="flex"
      alignItems="center"
      justifyContent="center"
      __flexShrink={0}
      __width={14}
      __height={14}
    >
      <Settings size={12} strokeWidth={2} />
    </Box>
  );
}
