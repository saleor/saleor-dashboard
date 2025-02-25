import { Box } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

export const RangeInputWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Box display="flex" gap={0.5} alignItems="center" flexWrap="wrap">
      {children}
    </Box>
  );
};
