import { Box } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

interface OrderTransactionTileRootProps {
  error: boolean;
  children: ReactNode;
}

export const OrderTransactionTileRoot = ({
  error,
  children,
}: OrderTransactionTileRootProps) => {
  return (
    <Box
      borderStyle="solid"
      borderWidth={1}
      borderColor={!!error ? "critical1" : "default1"}
      borderRadius={3}
      display="flex"
      flexDirection="column"
    >
      {children}
    </Box>
  );
};
