import { Rule } from "@dashboard/discounts/models";
import { sortRules } from "@dashboard/discounts/utils";
import { useEffect, useState } from "react";

export const useRulesHandlers = (
  discountType: "catalog", // to be replaced by PromotionTypeEnum when API return this field
) => {
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    setRules([]);
  }, [discountType]);

  const onDeleteRule = (ruleDeleteIndex: number) => {
    setRules(rules =>
      sortRules(rules.filter((_, index) => index !== ruleDeleteIndex)),
    );
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

  return {
    rules,
    onDeleteRule,
    onRuleSubmit,
  };
};
