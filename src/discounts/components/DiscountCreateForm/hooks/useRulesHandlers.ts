import { type Rule } from "@dashboard/discounts/models/Rule";
import { sortRules } from "@dashboard/discounts/utils";
import { useState } from "react";

export const useRulesHandlers = () => {
  const [rules, setRules] = useState<Rule[]>([]);

  const onDeleteRule = (ruleDeleteIndex: number) => {
    setRules(rules => sortRules(rules.filter((_, index) => index !== ruleDeleteIndex)));
  };
  const onRuleSubmit = async (data: Rule, ruleEditIndex: number | null) => {
    if (ruleEditIndex !== null) {
      setRules(rules => {
        rules[ruleEditIndex] = data;

        return rules;
      });
    } else {
      setRules(sortRules([...rules, data]));
    }
  };
  /** Rules only work for the type they were added under, so a confirmed type change clears them. */
  const clearRules = (): void => {
    setRules([]);
  };

  return {
    rules,
    onDeleteRule,
    onRuleSubmit,
    clearRules,
  };
};
