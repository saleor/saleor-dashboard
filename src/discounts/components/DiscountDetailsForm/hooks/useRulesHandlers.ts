import { Rule } from "@dashboard/discounts/models";
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
  const [rules, setRules] = useState<Rule[]>([]);
  const [rulesErrors, setRulesErrors] = useState<Array<CommonError<any>>>([]);
  const [labelsMap, setLabelMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data?.rules) {
      setRules(data.rules.map(rule => Rule.fromAPI(rule, labelsMap)) ?? []);
    }
  }, [data?.rules, labelsMap]);

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

  const updateRulesArray = (rule: Rule, index: number) => {
    updateLabels(rule);
    setRules(prevRules => {
      const newRules = [...prevRules];
      newRules[index] = rule;
      return newRules;
    });
  };

  const addNewRuleToArray = (rule: Rule) => {
    updateLabels(rule);
    setRules(prevRules => sortRules([...prevRules, rule]));
  };

  const removeRuleFromArray = (index: number) => {
    setRules(prevRules => {
      const newRules = [...prevRules];
      newRules.splice(index, 1);
      return newRules;
    });
  };

  const onRuleSubmit = async (rule: Rule, ruleEditIndex: number | null) => {
    let errors: Array<
      CommonError<
        PromotionRuleUpdateErrorFragment | PromotionRuleCreateErrorFragment
      >
    > = [];
    const ruleObj = Rule.fromFormValues(rule);
    if (ruleEditIndex !== null) {
      updateRulesArray(ruleObj, ruleEditIndex);
      errors = await onRuleUpdateSubmit(ruleObj);

      if (errors.length > 0) {
        setRulesErrors(errors);
      }
    } else {
      errors = await onRuleCreateSubmit(ruleObj);
      if (errors.length > 0) {
        setRulesErrors(errors);
      } else {
        addNewRuleToArray(ruleObj);
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
    removeRuleFromArray(ruleDeleteIndex);
  };

  return {
    rulesErrors,
    rules,
    onDeleteRule,
    onRuleSubmit,
  };
};
