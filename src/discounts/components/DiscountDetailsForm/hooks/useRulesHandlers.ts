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
      setRules(
        data.rules.map(rule =>
          Rule.fromAPI(rule, ruleConditionsOptionsDetailsMap),
        ) ?? [],
      );
    }
  }, [data?.rules, ruleConditionsOptionsDetailsMap]);

  const onRuleSubmit = async (rule: Rule, ruleEditIndex: string | null) => {
    let errors: Array<
      CommonError<
        PromotionRuleUpdateErrorFragment | PromotionRuleCreateErrorFragment
      >
    > = [];

    if (ruleEditIndex !== null) {
      errors = await onRuleUpdateSubmit(rule);
      if (errors.length > 0) {
        setRulesErrors(errors);
      }
    } else {
      errors = await onRuleCreateSubmit(rule);
      if (errors.length > 0) {
        setRulesErrors(errors);
      }
    }
  };

  const onDeleteRule = async (ruleDeleteIndex: string) => {
    if (ruleDeleteIndex === null) {
      return;
    }

    const ruleId = rules[Number(ruleDeleteIndex)].id;
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
