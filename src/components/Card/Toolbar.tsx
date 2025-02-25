import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

export const Toolbar = ({ children, ...rest }: PropsWithBox<{ children: ReactNode }>) => (
  <Box display="flex" flexDirection="row" gap={2} {...rest}>
    {children}
  </Box>
);
