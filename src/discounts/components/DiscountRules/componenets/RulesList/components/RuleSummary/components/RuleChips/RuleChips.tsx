import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context/consumer";
import { Condition, Rule } from "@dashboard/discounts/models";
import useLocale from "@dashboard/hooks/useLocale";
import { useTheme } from "@saleor/macaw-ui-next";
import React from "react";

import { mapConditionToOption, splitConditions } from "../../utils";
import { RuleSummaryChips } from "../RuleSummaryChips";
import { RuleSummaryTooltip } from "../RuleSummaryTooltip/RuleSummaryTooltip";

interface RuleChipsProps {
  rule: Rule;
  currencySymbol: string;
}

export const RuleChips = ({ rule, currencySymbol }: RuleChipsProps) => {
  const { theme } = useTheme();
  const { locale } = useLocale();
  const { getConditionInputTypeByLabel } = useDiscountRulesContext();

  const conditionWithInputType = rule.conditions.map(
    toConditionWithInputType(getConditionInputTypeByLabel),
  );

  const conditions = mapConditionToOption(
    conditionWithInputType,
    currencySymbol,
    locale,
  );

  const { conditionsInSummary, conditionsInTooltip } =
    splitConditions(conditions);

  const hasConditionInTooltip = conditionsInTooltip.length > 0;

  return (
    <>
      {conditionsInSummary.map(({ value, label, type }) => (
        <RuleSummaryChips key={value} type={type} theme={theme} label={label} />
      ))}
      {hasConditionInTooltip ? (
        <RuleSummaryTooltip
          conditionsValues={conditionsInTooltip}
          theme={theme}
        />
      ) : null}
    </>
  );
};

function toConditionWithInputType(
  getConditionInputTypeByLabel: (name: string, type: string) => string | null,
) {
  return (condition: Condition): Condition & { inputType: string | null } => {
    return Object.assign(condition, {
      inputType: getConditionInputTypeByLabel(condition.name, condition.type),
    });
  };
}
