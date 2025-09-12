import { Box } from "@saleor/macaw-ui-next";
import * as React from "react";

export const RangeInputWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box display="flex" gap={0.5} alignItems="center" flexWrap="wrap">
      {children}
    </Box>
  );
};
