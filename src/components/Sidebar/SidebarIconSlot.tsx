import { Box } from "@saleor/macaw-ui-next";

const SIDEBAR_ICON_SLOT_SIZE = 20;

export const SidebarIconSlot = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <Box
    color="default2"
    display="flex"
    alignItems="center"
    justifyContent="center"
    __flexShrink={0}
    __width={SIDEBAR_ICON_SLOT_SIZE}
    __height={SIDEBAR_ICON_SLOT_SIZE}
  >
    {children}
  </Box>
);
