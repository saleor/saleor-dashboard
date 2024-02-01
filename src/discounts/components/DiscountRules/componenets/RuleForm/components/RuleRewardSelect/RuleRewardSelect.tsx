import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { Rule } from "@dashboard/discounts/models";
import { Box, Select } from "@saleor/macaw-ui-next";
import React from "react";
import { useController } from "react-hook-form";
import { useIntl } from "react-intl";

import { RuleRewardPrice } from "../../RuleRewardPrice";
import { RuleRewardGifts } from "../RuleRewardGifts";
import { getRewardTypeOptions } from "./rewardTypeOptions";

export const RuleRewardSelect = () => {
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
        data-test-id="reward-type-select"
        size="medium"
        options={rewardTypeOptions}
        disabled={disabled}
      />
      {rewardType.value === "GIFT" ? (
        <RuleRewardGifts />
      ) : (
        <RuleRewardPrice currencySymbol="£" error={null} />
      )}
    </Box>
  );
};
