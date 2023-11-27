import { DiscoutFormData } from "@dashboard/discounts/types";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useController } from "react-hook-form";
import { useIntl } from "react-intl";

import { messages } from "../../../../messages";
import { DiscountTypeSwitch } from "../DiscountTypeSwitch";
import { RuleInputWrapper } from "../RuleInputWrapper/RuleInputWrapper";

interface RuleRewardProps {
  disabled?: boolean;
  currencySymbol: string | null;
  index: number;
}

export const RuleReward = ({
  index,
  currencySymbol,
  disabled,
}: RuleRewardProps) => {
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
    <>
      <Text as="p">{intl.formatMessage(messages.reward)}</Text>
      <Box display="flex" gap={4}>
        <DiscountTypeSwitch
          disabled={disabled}
          onChange={type => rewardTypeField.onChange(type)}
          selected={rewardTypeField.value}
          currencySymbol={currencySymbol}
        />
        <RuleInputWrapper __flex="1">
          <Input
            {...rewardValueType}
            disabled={disabled || rewardValueType.disabled}
            type="number"
            label={intl.formatMessage(messages.discountValue)}
          />
        </RuleInputWrapper>
      </Box>
    </>
  );
};
