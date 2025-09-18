import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

export const LastLoginIndicator = () => {
  return (
    <Box
      position="absolute"
      __inset="-9px -6px auto auto"
      backgroundColor="info1"
      paddingX={2}
      borderRadius={4}
    >
      <Text size={1}>Last used</Text>
    </Box>
  );
};
