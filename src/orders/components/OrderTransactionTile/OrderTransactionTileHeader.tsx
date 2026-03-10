import { Box } from "@macaw-ui";
import { type ReactNode } from "react";

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
