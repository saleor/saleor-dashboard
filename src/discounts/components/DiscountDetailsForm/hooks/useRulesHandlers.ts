import { Rule } from "@dashboard/discounts/models";
import {
  PromotionDetailsFragment,
  PromotionRuleCreateErrorFragment,
  PromotionRuleUpdateErrorFragment,
} from "@dashboard/graphql";
import { CommonError } from "@dashboard/utils/errors/common";
import { useEffect, useState } from "react";

interface UseRulesHandlersProps {
  data: PromotionDetailsFragment | undefined | null;
  ruleConditionsOptionsDetailsMap: Record<string, string>;
  onRuleUpdateSubmit: (
    data: Rule,
  ) => Promise<Array<CommonError<PromotionRuleUpdateErrorFragment>>>;
  onRuleCreateSubmit: (
    data: Rule,
  ) => Promise<Array<CommonError<PromotionRuleCreateErrorFragment>>>;
  onRuleDeleteSubmit: (id: string) => void;
}

export const useRulesHandlers = ({
  data,
  ruleConditionsOptionsDetailsMap,
  onRuleUpdateSubmit,
  onRuleCreateSubmit,
  onRuleDeleteSubmit,
}: UseRulesHandlersProps) => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [rulesErrors, setRulesErrors] = useState<Array<CommonError<any>>>([]);

  useEffect(() => {
    if (data?.rules) {
      setRules(rules => {
        const curretConditinLabels = rules
          .flatMap(rule => rule.conditions)
          .flatMap(condition => condition.values)
          .reduce((acc, value) => {
            if (value.value !== value.label) {
              acc[value.value] = value.label;
            }
            return acc;
          }, {} as Record<string, string>);

        return (
          data.rules.map(rule =>
            Rule.fromAPI(rule, {
              ...ruleConditionsOptionsDetailsMap,
              ...curretConditinLabels,
            }),
          ) ?? []
        );
      });
    }
  }, [data?.rules, ruleConditionsOptionsDetailsMap]);

  const onRuleSubmit = async (rule: Rule, ruleEditIndex: number | null) => {
    let errors: Array<
      CommonError<
        PromotionRuleUpdateErrorFragment | PromotionRuleCreateErrorFragment
      >
    > = [];
    const ruleObj = Rule.fromFormValues(rule);
    if (ruleEditIndex !== null) {
      errors = await onRuleUpdateSubmit(ruleObj);
      setRules(prevRules => {
        const newRules = [...prevRules];
        newRules[ruleEditIndex] = ruleObj;
        return newRules;
      });
      if (errors.length > 0) {
        setRulesErrors(errors);
      }
    } else {
      errors = await onRuleCreateSubmit(ruleObj);
      if (errors.length > 0) {
        setRulesErrors(errors);
      }
    }
  };

  const onDeleteRule = async (ruleDeleteIndex: number) => {
    if (ruleDeleteIndex === null) {
      return;
    }

    const ruleId = rules[ruleDeleteIndex].id;
    if (!ruleId) {
      return;
    }

    await onRuleDeleteSubmit(ruleId);
  };

  return {
    rulesErrors,
    rules,
    onDeleteRule,
    onRuleSubmit,
  };
};
