import { Box, PropsWithBox } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

export const Actions = ({ children, ...rest }: PropsWithBox<{ children: ReactNode }>) => {
  return (
    <Box display="flex" justifyContent="flex-end" gap={4} {...rest}>
      {children}
    </Box>
  );
};
