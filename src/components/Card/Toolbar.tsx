import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

export const Toolbar: React.FC<PropsWithBox<{ children: React.ReactNode }>> = ({
  children,
  ...rest
}) => <Box {...rest}>{children}</Box>;
