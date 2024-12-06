import { Box } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

interface OrderTrasactionTileHeaderProps {
  children: ReactNode;
}

export const OrderTransactionTileHeader = ({ children }: OrderTrasactionTileHeaderProps) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      {children}
    </Box>
  );
};
