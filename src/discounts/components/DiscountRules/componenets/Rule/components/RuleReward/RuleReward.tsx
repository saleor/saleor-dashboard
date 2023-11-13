import { Box, Input, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "../../../../messages";
import { DiscountTypeSwitch } from "../../../DiscountTypeSwitch";

export const RuleReward = () => {
  const intl = useIntl();
  return (
    <Box>
      <Text marginBottom={4} as="p">
        {intl.formatMessage(messages.reward)}
      </Text>
      <Box display="flex" gap={4}>
        <DiscountTypeSwitch
          onChange={() => {}}
          selected="fixed"
          currencySymbol="EUR"
        />
        <Box __flex="1">
          <Input
            onChange={() => {}}
            label={intl.formatMessage(messages.discountValue)}
          />
        </Box>
      </Box>
    </Box>
  );
};
