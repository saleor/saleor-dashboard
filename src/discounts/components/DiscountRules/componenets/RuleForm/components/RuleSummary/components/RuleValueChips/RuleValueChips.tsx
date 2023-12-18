import { Rule } from "@dashboard/discounts/models";
import { RewardValueTypeEnum } from "@dashboard/graphql";
import { Chip } from "@saleor/macaw-ui-next";
import React from "react";

interface RuleValueChipsProps {
  rule: Rule;
  currencySymbol: string;
}

export const RuleValueChips = ({
  currencySymbol,
  rule,
}: RuleValueChipsProps) => {
  const rewardTypeValue =
    rule.rewardValueType === RewardValueTypeEnum.FIXED ? currencySymbol : "%";

  return (
    <Chip
      backgroundColor="accent1Pressed"
      borderColor="accent1"
      color="default1"
    >
      {`${rule.rewardValue}${rewardTypeValue}`}
    </Chip>
  );
};
