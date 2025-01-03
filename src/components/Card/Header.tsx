import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import * as React from "react";

export const Header = ({
  children,
  className,
  ...rest
}: PropsWithBox<{ children: React.ReactNode }>) => (
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
