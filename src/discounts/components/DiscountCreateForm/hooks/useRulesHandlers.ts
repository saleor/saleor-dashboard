import { Rule } from "@dashboard/discounts/models";
import { useState } from "react";

export const useRulesHandlers = () => {
  const [rules, setRules] = useState<Rule[]>([]);

  const onDeleteRule = (ruleDeleteIndex: number) => {
    setRules(rules => rules.filter((_, index) => index !== ruleDeleteIndex));
  };

  const onRuleSubmit = async (data: Rule, ruleEditIndex: number | null) => {
    if (ruleEditIndex !== null) {
      setRules(rules => {
        rules[ruleEditIndex] = data;
        return rules;
      });
    } else {
      setRules([...rules, data]);
    }
  };

  return {
    rules,
    onDeleteRule,
    onRuleSubmit,
  };
};
