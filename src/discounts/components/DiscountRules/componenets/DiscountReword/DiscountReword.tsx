import { Box, Input, Text } from "@saleor/macaw-ui-next";
import React from "react";

import { DiscountTypeSwitch } from "../DiscountTypeSwitch/DiscountTypeSwitch";

export const DiscountReword = () => {
  return (
    <Box>
      <Text marginBottom={4} as="p">
        Reward
      </Text>
      <Box display="flex" gap={4}>
        <DiscountTypeSwitch
          onChange={() => {}}
          selected="fixed"
          currencySymbol="EUR"
        />
        <Box __flex="1">
          <Input onChange={() => {}} label="Discount value" />
        </Box>
      </Box>
    </Box>
  );
};
