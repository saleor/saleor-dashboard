import { Rule } from "@dashboard/discounts/types";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { messages } from "../../../../messages";
import { DiscountTypeSwitch } from "../DiscountTypeSwitch";
import { RuleInputWrapper } from "../RuleInputWrapper/RuleInputWrapper";

interface RuleRewardProps {
  disabled?: boolean;
  currencySymbol: string | null;
  error: string | undefined;
}

export const RuleReward = ({
  currencySymbol,
  disabled,
  error,
}: RuleRewardProps) => {
  const intl = useIntl();
  const { watch } = useFormContext<Rule>();
  const { field: rewardTypeField } = useController<Rule, "rewardValueType">({
    name: "rewardValueType",
  });

  const { field: rewardValueType } = useController<Rule, "rewardValue">({
    name: "rewardValue",
  });

  const discountType = watch("rewardValueType");

  return (
    <>
      <Text as="p">{intl.formatMessage(messages.reward)}</Text>
      <Box display="flex" gap={4}>
        <DiscountTypeSwitch
          disabled={disabled}
          onChange={type => rewardTypeField.onChange(type)}
          selected={discountType}
          currencySymbol={currencySymbol}
        />
        <RuleInputWrapper __flex="1">
          <Input
            {...rewardValueType}
            error={!!error}
            helperText={error}
            disabled={disabled || rewardValueType.disabled}
            type="number"
            label={intl.formatMessage(messages.discountValue)}
          />
        </RuleInputWrapper>
      </Box>
    </>
  );
};
