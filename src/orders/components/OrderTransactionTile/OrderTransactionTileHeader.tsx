import { Box } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

interface OrderTrasactionTileHeaderProps {
  children: ReactNode;
}

export const OrderTransactionTileHeader = ({
  children,
}: OrderTrasactionTileHeaderProps) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      paddingRight={4}
    >
      {children}
    </Box>
  );
};
