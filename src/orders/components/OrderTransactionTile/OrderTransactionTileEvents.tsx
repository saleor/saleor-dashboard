import { Box, vars } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

interface OrderTransactionTileEventsProps {
  children: ReactNode;
}

export const OrderTransactionTileEvents = ({ children }: OrderTransactionTileEventsProps) => {
  return (
    <Box display="grid" gap="px" __backgroundColor={vars.colors.border.default1}>
      {children}
    </Box>
  );
};
