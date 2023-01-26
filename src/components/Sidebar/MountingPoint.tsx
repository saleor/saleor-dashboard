import sideBarDefaultLogo from "@assets/images/sidebar-default-logo.png";
import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";

export const MountingPoint = () => (
  <Box display="flex" gap={5} paddingX={6} paddingY={7}>
    {/* TODO: use Avatar when https://github.com/saleor/macaw-ui/pull/225 is merged */}
    <Box
      __width="24px"
      __height="24px"
      as="img"
      src={sideBarDefaultLogo}
      alt="Saleor dashboard logo"
      borderRadius={2}
    />

    <Text variant="bodyEmp" size="medium">
      Saleor Dashboard
    </Text>
  </Box>
);
