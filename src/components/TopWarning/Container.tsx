import { Box } from "@saleor/macaw-ui-next";
import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
  return (
    <Box
      backgroundColor="warning1"
      paddingX={3}
      paddingY={0.5}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {children}
    </Box>
  );
};
