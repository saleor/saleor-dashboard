import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

export const Header: React.FC<PropsWithBox<{ children: React.ReactNode }>> = ({
  children,
  className,
  ...rest
}) => (
  <Box
    paddingX={6}
    paddingTop={6}
    className={className}
    display="flex"
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    {...rest}
  >
    {children}
  </Box>
);
