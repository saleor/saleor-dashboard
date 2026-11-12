import { type Rule } from "@dashboard/discounts/models/Rule";
import { mapAPIRuleToForm } from "@dashboard/discounts/models/transformRule";
import { sortRules } from "@dashboard/discounts/utils";
import {
  type PromotionDetailsFragment,
  type PromotionRuleCreateErrorFragment,
  type PromotionRuleUpdateErrorFragment,
} from "@dashboard/graphql";
import { type CommonError } from "@dashboard/utils/errors/common";
import { useEffect, useState } from "react";

import { getCurrentConditionsValuesLabels } from "../utils";

interface UseRulesHandlersProps {
  data: PromotionDetailsFragment | undefined | null;
  ruleConditionsOptionsDetailsMap: Record<string, string>;
  giftsOptionsDetailsMap: Record<string, string>;
  onRuleUpdateSubmit: (data: Rule) => Promise<Array<CommonError<PromotionRuleUpdateErrorFragment>>>;
  onRuleCreateSubmit: (data: Rule) => Promise<Array<CommonError<PromotionRuleCreateErrorFragment>>>;
  onRuleDeleteSubmit: (id: string) => Promise<boolean>;
}

export const useRulesHandlers = ({
  data,
  ruleConditionsOptionsDetailsMap,
  giftsOptionsDetailsMap,
  onRuleUpdateSubmit,
  onRuleCreateSubmit,
  onRuleDeleteSubmit,
}: UseRulesHandlersProps) => {
  const [rulesErrors, setRulesErrors] = useState<Array<CommonError<any>>>([]);
  const [conditionValuesLabelMap, setConditionValuesLabelMap] = useState<Record<string, string>>(
    {},
  );
  const rules = sortRules(
    data?.rules?.map(rule =>
      mapAPIRuleToForm(data?.type, rule, {
        conditionsValues: conditionValuesLabelMap,
        gifts: giftsOptionsDetailsMap,
      }),
    ) ?? [],
  );

  useEffect(() => {
    setConditionValuesLabelMap(labels => {
      return {
        ...ruleConditionsOptionsDetailsMap,
        ...labels,
      };
    });
  }, [ruleConditionsOptionsDetailsMap]);

  const updateLabels = (rule: Rule) => {
    setConditionValuesLabelMap(labels => ({
      ...labels,
      ...getCurrentConditionsValuesLabels([rule]),
    }));
  };
  /** Saves the rule, and resolves to whether it was saved without errors. */
  const onRuleSubmit = async (rule: Rule, ruleEditIndex: number | null): Promise<boolean> => {
    updateLabels(rule);

    const errors: Array<
      CommonError<PromotionRuleUpdateErrorFragment | PromotionRuleCreateErrorFragment>
    > = ruleEditIndex !== null ? await onRuleUpdateSubmit(rule) : await onRuleCreateSubmit(rule);

    // Errors from an earlier attempt don't apply to a rule saved now.
    setRulesErrors(errors);

    return errors.length === 0;
  };
  const onDeleteRule = async (ruleDeleteIndex: number): Promise<boolean> => {
    if (ruleDeleteIndex === null) {
      return false;
    }

    const ruleId = rules[ruleDeleteIndex].id;

    if (!ruleId) {
      return false;
    }

    return onRuleDeleteSubmit(ruleId);
  };

  return {
    rulesErrors,
    rules,
    onDeleteRule,
    onRuleSubmit,
  };
};
