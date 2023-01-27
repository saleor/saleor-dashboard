import sideBarDefaultLogo from "@assets/images/sidebar-default-logo.png";
import { Avatar, Box, Text } from "@saleor/macaw-ui/next";
import React from "react";

export const MountingPoint = () => (
  <Box display="flex" gap={5} paddingX={6} paddingY={7}>
    <Avatar.Store src={sideBarDefaultLogo} scheme="decorative2" size="small" />
    <Text variant="bodyEmp" size="medium">
      Saleor Dashboard
    </Text>
  </Box>
);
