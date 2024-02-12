import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { Rule } from "@dashboard/discounts/models";
import { Option, Select } from "@saleor/macaw-ui-next";
import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { getRewardTypeOptions } from "./rewardTypeOptions";

export const RuleRewardTypeSelect = () => {
  const intl = useIntl();
  const { disabled } = useDiscountRulesContext();
  const { formState, setValue } = useFormContext<Rule>();

  const rewardTypeOptions = getRewardTypeOptions(intl);

  const ruleRewardTypeFileName = `rewardType` as const;
  const { field: rewardType } = useController<
    Rule,
    typeof ruleRewardTypeFileName
  >({
    name: ruleRewardTypeFileName,
  });

  return (
    <Select
      {...rewardType}
      label={intl.formatMessage({
        defaultMessage: "Reward type",
        id: "9CW3TD",
        description: "label",
      })}
      value={
        rewardTypeOptions.find(option => option.value === rewardType.value) ??
        ""
      }
      error={!!formState.errors.rewardType}
      helperText={formState.errors.rewardType?.message}
      onChange={type => {
        setValue("rewardGifts", []);
        setValue("rewardValue", null);
        rewardType.onChange((type as unknown as Option).value);
      }}
      data-test-id="reward-type-select"
      size="small"
      options={rewardTypeOptions}
      disabled={disabled}
    />
  );
};
