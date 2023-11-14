import { Inputs } from "@dashboard/discounts/components/DiscountCreatePage/types";
import { DiscountType } from "@dashboard/discounts/components/DiscountRules/types";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useController } from "react-hook-form";
import { useIntl } from "react-intl";

import { messages } from "../../../../messages";
import { DiscountTypeSwitch } from "../../../DiscountTypeSwitch";

export const RuleReward = ({ index }: { index: number }) => {
  const intl = useIntl();
  const { field: rewardTypeField } = useController<
    Inputs,
    `rules.${number}.rewardValueType`
  >({
    name: `rules.${index}.rewardValueType`,
  });
  const { field: rewardValueType } = useController<
    Inputs,
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
          selected={rewardTypeField.value as DiscountType}
          currencySymbol="EUR"
        />
        <Box __flex="1">
          <Input
            {...rewardValueType}
            label={intl.formatMessage(messages.discountValue)}
          />
        </Box>
      </Box>
    </Box>
  );
};
