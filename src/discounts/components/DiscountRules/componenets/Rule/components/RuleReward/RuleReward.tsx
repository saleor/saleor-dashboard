import { DiscoutFormData } from "@dashboard/discounts/types";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useController } from "react-hook-form";
import { useIntl } from "react-intl";

import { messages } from "../../../../messages";
import { DiscountTypeSwitch } from "../DiscountTypeSwitch";

interface RuleRewardProps {
  currencySymbol: string | null;
  index: number;
}

export const RuleReward = ({ index, currencySymbol }: RuleRewardProps) => {
  const intl = useIntl();

  const { field: rewardTypeField } = useController<
    DiscoutFormData,
    `rules.${number}.rewardValueType`
  >({
    name: `rules.${index}.rewardValueType`,
  });

  const { field: rewardValueType } = useController<
    DiscoutFormData,
    `rules.${number}.rewardValue`
  >({
    name: `rules.${index}.rewardValue`,
  });

  return (
    <Box>
      <Text marginBottom={4} as="p">
        {intl.formatMessage(messages.reward)}
      </Text>
      <Box display="flex" gap={4}>
        <DiscountTypeSwitch
          onChange={type => rewardTypeField.onChange(type)}
          selected={rewardTypeField.value}
          currencySymbol={currencySymbol}
        />
        <Box __flex="1">
          <Input
            {...rewardValueType}
            type="number"
            label={intl.formatMessage(messages.discountValue)}
          />
        </Box>
      </Box>
    </Box>
  );
};
