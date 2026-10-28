import { Box } from "@saleor/macaw-ui-next";

import { DeprecationBanner } from "./DeprecationBanner/DeprecationBanner";
import { Menu } from "./menu/Menu";
import { MountingPoint } from "./MountingPoint";
import { useSidebarCollapse } from "./SidebarContext";
import { UserInfo } from "./user/Info";

/**
 * - `full`: always expanded (the drawer).
 * - `collapsible`: the column, following the viewer's collapse preference.
 * - `rail`: always collapsed, where the full sidebar does not fit beside the page.
 */
export type SidebarContentVariant = "full" | "collapsible" | "rail";

interface SidebarContentProps {
  variant?: SidebarContentVariant;
}

export const SidebarContent = ({ variant = "full" }: SidebarContentProps) => {
  const { isCollapsed } = useSidebarCollapse();
  const collapsed = variant === "rail" || (variant === "collapsible" && isCollapsed);

  return (
    <Box
      backgroundColor="default2"
      as="aside"
      height="100%"
      display="grid"
      __gridTemplateColumns="minmax(0, 1fr)"
      __gridTemplateRows="auto 1fr auto"
    >
      <Box>
        <MountingPoint variant={variant} collapsed={collapsed} />
        <DeprecationBanner compact={collapsed} />
      </Box>
      <Menu collapsed={collapsed} />
      <UserInfo collapsed={collapsed} />
    </Box>
  );
};
