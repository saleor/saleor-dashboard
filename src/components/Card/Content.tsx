import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

export const Content = ({ children, ...rest }: PropsWithBox<{ children?: ReactNode }>) => (
  <Box paddingX={6} {...rest}>
    {children}
  </Box>
);
