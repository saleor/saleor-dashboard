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
  hasSelectedChannels: boolean;
}

export const RuleReward = ({
  currencySymbol,
  disabled,
  error,
  hasSelectedChannels,
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

  if (!hasSelectedChannels) {
    return (
      <Box display="flex" flexDirection="column" gap={4}>
        <Text>{intl.formatMessage(messages.reward)}</Text>
        <Text variant="caption" color="textNeutralSubdued">
          {intl.formatMessage(messages.noChannelsSelected)}
        </Text>
      </Box>
    );
  }

  return (
    <>
      <Text as="p">{intl.formatMessage(messages.reward)}</Text>
      <Box display="flex" gap={4} justifyContent="flex-end">
        <DiscountTypeSwitch
          disabled={disabled}
          onChange={type => rewardTypeField.onChange(type)}
          selected={discountType}
          currencySymbol={currencySymbol}
        />
        <RuleInputWrapper __width={220}>
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
