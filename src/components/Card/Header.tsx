import { Box, BoxProps } from "@saleor/macaw-ui-next";
import React, { PropsWithChildren } from "react";

type HeaderProps = BoxProps;

export const Header: React.FC<PropsWithChildren<HeaderProps>> = ({
  children,
  className,
  ...rest
}) => (
  <Box paddingX={6} paddingTop={6} className={className} {...rest}>
    {children}
  </Box>
);
