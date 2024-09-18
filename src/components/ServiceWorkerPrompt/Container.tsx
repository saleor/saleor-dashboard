import { Box } from "@saleor/macaw-ui-next";
import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
  return <Box __gridColumn="1 / span 2">{children}</Box>;
};
