import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

export const NoValue = ({ locale }: { locale: Record<string, string> }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Text>{locale.noValueText}</Text>
    </Box>
  );
};
