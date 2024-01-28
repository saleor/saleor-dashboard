import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

export const MountingPoint = () => {
  return (
    <Box display="flex" gap={3} paddingX={4} paddingY={5} alignItems="center">
      <Text variant="bodyStrong" size="small">
        Tonserve Dashboard
      </Text>
    </Box>
  );
};
