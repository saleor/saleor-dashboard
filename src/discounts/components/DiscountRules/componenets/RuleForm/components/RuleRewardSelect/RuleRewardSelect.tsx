import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { Rule } from "@dashboard/discounts/models";
import { Box, Option, Select } from "@saleor/macaw-ui-next";
import React from "react";
import { useController } from "react-hook-form";
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

  const rewardTypeOptions = getRewardTypeOptions(intl);

  const ruleRewardTypeFileName = `rewardType` as const;
  const { field: rewardType } = useController<
    Rule,
    typeof ruleRewardTypeFileName
  >({
    name: ruleRewardTypeFileName,
  });

  return (
    <Box>
      <Select
        {...rewardType}
        onChange={type => {
          rewardType.onChange((type as unknown as Option).value);
        }}
        data-test-id="reward-type-select"
        size="medium"
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
