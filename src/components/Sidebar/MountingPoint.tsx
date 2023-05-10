import sideBarDefaultLogoDarkMode from "@assets/images/sidebar-deafult-logo-darkMode.png";
import sideBarDefaultLogo from "@assets/images/sidebar-default-logo.png";
import { useLegacyThemeHandler } from "@dashboard/components/Sidebar/user/Controls";
import { Avatar, Box, Text } from "@saleor/macaw-ui/next";
import React from "react";

export const MountingPoint = () => {
  const { theme } = useLegacyThemeHandler();
  const logo =
    theme === "defaultLight" ? sideBarDefaultLogo : sideBarDefaultLogoDarkMode;

  return (
    <Box display="flex" gap={6} paddingX={7} paddingY={8} alignItems="center">
      <Avatar.Store src={logo} scheme="decorative2" size="small" />
      <Text variant="bodyStrong" size="small">
        Saleor Dashboard
      </Text>
    </Box>
  );
};
