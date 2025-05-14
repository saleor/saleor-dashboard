import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

export const InstallSectionErrors = ({ errors }: { errors: string[] }) => {
  if (!errors.length) {
    return null;
  }

  return (
    <Box>
      {errors.map((error, index) => (
        <Text color="critical1" key={index}>
          {error}
        </Text>
      ))}
    </Box>
  );
};
