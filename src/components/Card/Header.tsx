import { Box, BoxProps, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

const toolbarWrapperStyles = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
} as BoxProps;

export const Header: React.FC<
  PropsWithBox<{ withToolbar?: boolean; children: React.ReactNode }>
> = ({ children, className, withToolbar = false, ...rest }) => (
  <Box
    paddingX={6}
    paddingTop={6}
    className={className}
    // {...(withToolbar && toolbarWrapperStyles)}
    {...toolbarWrapperStyles}
    {...rest}
  >
    {children}
  </Box>
);
