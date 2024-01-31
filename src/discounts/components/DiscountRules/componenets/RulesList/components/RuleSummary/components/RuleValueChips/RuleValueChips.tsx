import { formatMoney } from "@dashboard/components/Money";
import { formatPercantage } from "@dashboard/components/Percent/utils";
import { Rule } from "@dashboard/discounts/models";
import { RewardValueTypeEnum } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
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
  const { locale } = useLocale();

  const rewardValueWithCurrency = formatMoney(
    {
      amount: rule.rewardValue,
      currency: currencySymbol,
    },
    locale,
  );

  const rewardValueWithPercentage = formatPercantage(rule.rewardValue, locale);

  return (
    <Chip
      backgroundColor="accent1Pressed"
      borderColor="accent1"
      color="default1"
    >
      {rule.rewardValueType === RewardValueTypeEnum.FIXED
        ? rewardValueWithCurrency
        : rewardValueWithPercentage}
    </Chip>
  );
};
