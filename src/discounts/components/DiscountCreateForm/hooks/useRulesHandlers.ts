import { Rule } from "@dashboard/discounts/models";
import { createRuleFromData } from "@dashboard/discounts/models/factory";
import { sortRules } from "@dashboard/discounts/utils";
import { useState } from "react";

export const useRulesHandlers = () => {
  const [rules, setRules] = useState<Rule[]>([]);

  const onDeleteRule = (ruleDeleteIndex: number) => {
    setRules(rules => rules.filter((_, index) => index !== ruleDeleteIndex));
  };

  const onRuleSubmit = async (data: Rule, ruleEditIndex: number | null) => {
    const ruleObj = createRuleFromData(data);

    if (ruleEditIndex !== null && ruleObj) {
      setRules(rules => {
        rules[ruleEditIndex] = ruleObj;
        return rules;
      });
    } else {
      setRules(sortRules([...rules, ruleObj]));
    }
  };

  return {
    rules,
    onDeleteRule,
    onRuleSubmit,
  };
};
