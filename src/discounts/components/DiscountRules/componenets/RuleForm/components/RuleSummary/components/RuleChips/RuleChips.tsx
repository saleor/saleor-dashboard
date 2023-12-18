import { Rule } from "@dashboard/discounts/models";
import { useTheme } from "@saleor/macaw-ui-next";
import React from "react";

import { mapConditionToOption, splitConditions } from "../../utils";
import { RuleSummaryChips } from "../RuleSummaryChips";
import { RuleSummaryTooltip } from "../RuleSummaryTooltip/RuleSummaryTooltip";

interface RuleChipsProps {
  rule: Rule;
}

export const RuleChips = ({ rule }: RuleChipsProps) => {
  const { theme } = useTheme();

  const conditions = mapConditionToOption(rule.conditions);
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
