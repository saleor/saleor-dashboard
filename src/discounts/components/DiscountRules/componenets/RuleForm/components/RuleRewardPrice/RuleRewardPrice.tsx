import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { Rule } from "@dashboard/discounts/models";
import { Box, Input } from "@saleor/macaw-ui-next";
import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { messages } from "../../../../messages";
import { DiscountTypeSwitch } from "../DiscountTypeSwitch";
import { RuleInputWrapper } from "../RuleInputWrapper";

interface RuleRewardPriceProps {
  currencySymbol: string | null;
  error: string | undefined;
}

export const RuleRewardPrice = ({
  currencySymbol,
  error,
}: RuleRewardPriceProps) => {
  const intl = useIntl();
  const { disabled } = useDiscountRulesContext();
  const { watch, formState } = useFormContext<Rule>();
  const discountType = watch("rewardValueType");

  const { field: rewardTypeField } = useController<Rule, "rewardValueType">({
    name: "rewardValueType",
  });

  const { field: rewardValueType } = useController<Rule, "rewardValue">({
    name: "rewardValue",
  });

  return (
    <Box display="flex" gap={4}>
      <DiscountTypeSwitch
        onChange={type => rewardTypeField.onChange(type)}
        selected={discountType}
        currencySymbol={currencySymbol}
      />
      <RuleInputWrapper width="100%">
        <Input
          value={rewardValueType.value || ""}
          onBlur={rewardValueType.onBlur}
          name={rewardValueType.name}
          ref={rewardValueType.ref}
          onChange={e => {
            const value = parseInt(e.target.value, 10);
            rewardValueType.onChange(Number.isNaN(value) ? null : value);
          }}
          error={!!error || !!formState.errors?.rewardValue?.message}
          helperText={error || formState.errors?.rewardValue?.message}
          disabled={disabled || rewardValueType.disabled}
          type="number"
          size="small"
          label={intl.formatMessage(messages.discountValue)}
        />
      </RuleInputWrapper>
    </Box>
  );
};
