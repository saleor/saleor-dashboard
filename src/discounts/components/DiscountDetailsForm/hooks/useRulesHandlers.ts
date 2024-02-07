import { mapAPIRuleToForm, Rule } from "@dashboard/discounts/models";
import { sortRules } from "@dashboard/discounts/utils";
import {
  PromotionDetailsFragment,
  PromotionRuleCreateErrorFragment,
  PromotionRuleUpdateErrorFragment,
} from "@dashboard/graphql";
import { CommonError } from "@dashboard/utils/errors/common";
import { useEffect, useState } from "react";

import { getCurrentConditionsValuesLabels } from "../utils";

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
  const [rulesErrors, setRulesErrors] = useState<Array<CommonError<any>>>([]);
  const [labelsMap, setLabelMap] = useState<Record<string, string>>({});

  const rules = sortRules(
    data?.rules?.map(rule => mapAPIRuleToForm("catalog", rule, labelsMap)) ??
      [],
  );

  useEffect(() => {
    setLabelMap(labels => {
      return {
        ...ruleConditionsOptionsDetailsMap,
        ...labels,
      };
    });
  }, [ruleConditionsOptionsDetailsMap]);

  const updateLabels = (rule: Rule) => {
    setLabelMap(labels => ({
      ...labels,
      ...getCurrentConditionsValuesLabels([rule]),
    }));
  };

  const onRuleSubmit = async (rule: Rule, ruleEditIndex: number | null) => {
    let errors: Array<
      CommonError<
        PromotionRuleUpdateErrorFragment | PromotionRuleCreateErrorFragment
      >
    > = [];
    updateLabels(rule);

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
