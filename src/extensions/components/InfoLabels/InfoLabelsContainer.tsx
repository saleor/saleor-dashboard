import { Box, Text } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

interface InfoLabelsContainerProps {
  icon: ReactNode;
  message: ReactNode;
}

export const InfoLabelsContainer = ({ message, icon }: InfoLabelsContainerProps) => {
  return (
    <Box display="flex" alignItems="center" gap={1} color="default2">
      {icon}
      <Text size={2} color="default2">
        {message}
      </Text>
    </Box>
  );
};
