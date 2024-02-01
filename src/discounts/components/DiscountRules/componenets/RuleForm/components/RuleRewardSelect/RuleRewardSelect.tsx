import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { Rule } from "@dashboard/discounts/models";
import { Box, Option, Select } from "@saleor/macaw-ui-next";
import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { RuleRewardGifts } from "../RuleRewardGifts";
import { RuleRewardPrice } from "../RuleRewardPrice";
import { getRewardTypeOptions } from "./rewardTypeOptions";

interface RuleRewardSelectProps {
  currencySymbol: string | null;
  error: string | undefined;
}

export const RuleRewardSelect = ({
  error,
  currencySymbol,
}: RuleRewardSelectProps) => {
  const intl = useIntl();
  const { disabled } = useDiscountRulesContext();
  const { formState } = useFormContext<Rule>();

  const rewardTypeOptions = getRewardTypeOptions(intl);

  const ruleRewardTypeFileName = `rewardType` as const;
  const { field: rewardType } = useController<
    Rule,
    typeof ruleRewardTypeFileName
  >({
    name: ruleRewardTypeFileName,
  });

  return (
    <Box display="grid" __gridTemplateColumns="1fr 2fr" gap={4}>
      <Select
        {...rewardType}
        label={intl.formatMessage({
          defaultMessage: "Reward type",
          id: "9CW3TD",
          description: "label",
        })}
        value={rewardTypeOptions.find(
          option => option.value === rewardType.value,
        )}
        error={!!formState.errors.rewardType}
        helperText={formState.errors.rewardType?.message}
        onChange={type => {
          rewardType.onChange((type as unknown as Option).value);
        }}
        data-test-id="reward-type-select"
        size="small"
        options={rewardTypeOptions}
        disabled={disabled}
      />
      {rewardType.value === "GIFT" ? (
        <RuleRewardGifts />
      ) : (
        <RuleRewardPrice currencySymbol={currencySymbol} error={error} />
      )}
    </Box>
  );
};
