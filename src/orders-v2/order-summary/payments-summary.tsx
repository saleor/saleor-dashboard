import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

export const PaymentsSummary = () => {
  return (
    <Box>
      <Text>Payments summary</Text>
      <Text>All payments from registered transactions.</Text>
      <Box as="ul">
        <Box as="li">
          <Text>Authorised</Text>
          <Text>50.00</Text>
        </Box>
        <Box as="li">
          <Text>Captured</Text>
          <Text>75.00</Text>
        </Box>
        <Box as="li">
          <Text>Cancelled</Text>
          <Text>0.00</Text>
        </Box>
        <Box as="li">
          <Text>Total</Text>
          <Text>USD 125.10</Text>
        </Box>
      </Box>
    </Box>
  );
};
