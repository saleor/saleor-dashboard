import { Rule } from "@dashboard/discounts/models";

import { mapConditionToOption, splitConditions } from "../../utils";
import { RuleSummaryChips } from "../RuleSummaryChips";
import { RuleSummaryTooltip } from "../RuleSummaryTooltip";
import { useEnrichConditions } from "./useEnrichConditions";

interface RuleChipsProps {
  rule: Rule;
  currencySymbol: string;
}

export const RuleConditionsChips = ({ rule, currencySymbol }: RuleChipsProps) => {
  const enrichConditions = useEnrichConditions(rule.conditions, currencySymbol);
  const conditions = mapConditionToOption(enrichConditions);
  const { conditionsInSummary, conditionsInTooltip } = splitConditions(conditions);
  const hasConditionInTooltip = conditionsInTooltip.length > 0;

  return (
    <>
      {conditionsInSummary.map(({ label, value }) => (
        <RuleSummaryChips key={value} value={value} label={label} />
      ))}
      {hasConditionInTooltip ? <RuleSummaryTooltip conditionsValues={conditionsInTooltip} /> : null}
    </>
  );
};
