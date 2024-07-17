import { Box, BoxProps } from "@saleor/macaw-ui-next";
import React, { PropsWithChildren } from "react";

type ToolbarProps = BoxProps;

export const Toolbar: React.FC<PropsWithChildren<ToolbarProps>> = ({ children, ...rest }) => (
  <Box {...rest}>{children}</Box>
);

export const toolbarWrapperStyles = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
} as const;
