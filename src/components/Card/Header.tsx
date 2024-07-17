import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

export const toolbarWrapperStyles = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
} as const;

export const Header: React.FC<
  PropsWithBox<{ withToolbar?: boolean; children: React.ReactNode }>
> = ({ children, className, withToolbar = false, ...rest }) => (
  <Box
    paddingX={6}
    paddingTop={6}
    className={className}
    {...(withToolbar && toolbarWrapperStyles)}
    {...rest}
  >
    {children}
  </Box>
);
