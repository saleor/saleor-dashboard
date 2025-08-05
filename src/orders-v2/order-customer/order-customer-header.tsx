import { customerUrl } from "@dashboard/customers/urls";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

import { UnderlineLink } from "../underline-link";

export const OrderCustomerHeader = ({ userId }: { userId: string }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
      <Text size={5} fontWeight="medium">
        Customer details
      </Text>
      <Box display="flex" gap={4}>
        {/* TODO: add link to order list with filter by customer id */}
        <UnderlineLink href="/" size={2}>
          View orders
        </UnderlineLink>
        <UnderlineLink href={customerUrl(userId)} size={2}>
          View profile
        </UnderlineLink>
      </Box>
    </Box>
  );
};
