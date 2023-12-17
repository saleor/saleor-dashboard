import { Rule } from "@dashboard/discounts/models";
import { useState } from "react";

export const useRulesHandlers = () => {
  const [rules, setRules] = useState<Rule[]>([]);

  const onDeleteRule = (ruleDeleteIndex: number) => {
    setRules(rules => rules.filter((_, index) => index !== ruleDeleteIndex));
  };

  const onRuleSubmit = async (data: Rule, ruleEditIndex: number | null) => {
    const ruleObj = Rule.fromFormValues(data);

    if (ruleEditIndex !== null) {
      setRules(rules => {
        rules[ruleEditIndex] = ruleObj;
        return rules;
      });
    } else {
      setRules([...rules, ruleObj]);
    }
  };

  return {
    rules,
    onDeleteRule,
    onRuleSubmit,
  };
};
