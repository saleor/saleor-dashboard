import sideBarDefaultLogo from "@assets/images/sidebar-default-logo.png";
import { Avatar, Box, Text } from "@saleor/macaw-ui/next";
import React from "react";

export const MountingPoint = () => (
  <Box display="flex" gap={6} paddingX={7} paddingY={8} alignItems="center">
    <Avatar.Store src={sideBarDefaultLogo} scheme="decorative2" size="small" />
    <Text variant="bodyStrong" size="small">
      Saleor Dashboard
    </Text>
  </Box>
);
