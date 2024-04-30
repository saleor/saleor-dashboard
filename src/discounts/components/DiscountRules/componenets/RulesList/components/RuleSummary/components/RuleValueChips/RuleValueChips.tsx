import { Locale } from "@dashboard/components/Locale";
import { formatMoney } from "@dashboard/components/Money";
import { formatPercantage } from "@dashboard/components/Percent/utils";
import { Rule } from "@dashboard/discounts/models";
import { RewardTypeEnum, RewardValueTypeEnum } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { Chip } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

interface RuleValueChipsProps {
  rule: Rule;
  currencySymbol: string;
}

export const RuleValueChips = ({ currencySymbol, rule }: RuleValueChipsProps) => {
  const intl = useIntl();
  const { locale } = useLocale();

  return (
    <Chip
      backgroundColor="accent1Pressed"
      borderColor="accent1"
      color="default1"
      data-test-id="rule-value-chip"
    >
      {rule.rewardType === RewardTypeEnum.GIFT
        ? intl.formatMessage({ defaultMessage: "Gift", id: "ZBs2Pb" })
        : renderRuleValue(rule, currencySymbol, locale)}
    </Chip>
  );
};

function renderRuleValue(rule: Rule, currencySymbol: string, locale: Locale) {
  const rewardValueWithCurrency = formatMoney(
    {
      amount: rule.rewardValue ?? 0,
      currency: currencySymbol,
    },
    locale,
  );
  const rewardValueWithPercentage = formatPercantage(rule.rewardValue ?? 0, locale);

  return rule.rewardValueType === RewardValueTypeEnum.FIXED
    ? rewardValueWithCurrency
    : rewardValueWithPercentage;
}
