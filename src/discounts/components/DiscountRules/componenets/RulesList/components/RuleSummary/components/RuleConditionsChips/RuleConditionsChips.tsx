import { type Rule } from "@dashboard/discounts/models";
import { type Option } from "@saleor/macaw-ui-next";
import React from "react";

import { mapConditionToOption } from "../../utils";
import { RuleSummaryChips } from "../RuleSummaryChips";
import { RuleSummaryTooltip } from "../RuleSummaryTooltip";
import { useEnrichConditions } from "./useEnrichConditions";

const MAX_VISIBLE_PER_GROUP = 3;

interface RuleChipsProps {
  rule: Rule;
  currencySymbol: string;
}

export const RuleConditionsChips = ({ rule, currencySymbol }: RuleChipsProps) => {
  const enrichConditions = useEnrichConditions(rule.conditions, currencySymbol);
  const conditions = mapConditionToOption(enrichConditions);
  const grouped = groupByLabel(conditions);

  return (
    <>
      {Object.entries(grouped).map(([groupLabel, items]) => {
        const visible = items.slice(0, MAX_VISIBLE_PER_GROUP);
        const overflow = items.slice(MAX_VISIBLE_PER_GROUP);

        return (
          <React.Fragment key={groupLabel}>
            {visible.map(({ value, label }) => (
              <RuleSummaryChips key={value} value={value} label={label} />
            ))}
            {overflow.length > 0 && <RuleSummaryTooltip conditionsValues={overflow} />}
          </React.Fragment>
        );
      })}
    </>
  );
};

const groupByLabel = (conditions: Option[]): Record<string, Option[]> => {
  return conditions.reduce<Record<string, Option[]>>((acc, condition) => {
    const key = condition.label;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(condition);

    return acc;
  }, {});
};
