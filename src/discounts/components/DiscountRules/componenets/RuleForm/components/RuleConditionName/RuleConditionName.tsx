import { Combobox } from "@dashboard/components/Combobox";
import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { Condition, Rule } from "@dashboard/discounts/models";
import React from "react";
import { useController, useFormContext } from "react-hook-form";

import { useConditionNames } from "./useConditionNames";
import { getConditionNameValue } from "./utils";

interface RuleConditionNameProps {
  conditionIndex: number;
  updateCondition: (index: number, value: Condition) => void;
  isConditionTypeSelected: (conditionType: string) => boolean;
}

export const RuleConditionName = ({
  conditionIndex,
  updateCondition,
  isConditionTypeSelected,
}: RuleConditionNameProps) => {
  const { watch } = useFormContext<Rule>();
  const { disabled } = useDiscountRulesContext();
  const { conditionNames } = useConditionNames();

  const ruleConditionNameFieldName = `conditions.${conditionIndex}.id` as const;
  const { field: nameField } = useController<
    Rule,
    typeof ruleConditionNameFieldName
  >({
    name: ruleConditionNameFieldName,
  });
  const condition = watch(`conditions.${conditionIndex}`);

  const filteredConditionLeftOptions = conditionNames.filter(
    condition => !isConditionTypeSelected(condition.value),
  );

  return (
    <Combobox
      value={getConditionNameValue(nameField.value, conditionNames)}
      fetchOptions={() => {}}
      options={filteredConditionLeftOptions}
      onChange={e => {
        condition.value = [];
        updateCondition(conditionIndex, condition);
        nameField.onChange(e.target.value);
      }}
      size="medium"
      data-test-id="rule-type"
      onBlur={nameField.onBlur}
      disabled={disabled}
    />
  );
};
