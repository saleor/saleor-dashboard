import { Combobox } from "@dashboard/components/Combobox";
import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { useConditionNameOptions } from "@dashboard/discounts/components/DiscountRules/hooks/useConditionNameOptions";
import { Condition, Rule } from "@dashboard/discounts/models";
import React from "react";
import { useController, useFormContext } from "react-hook-form";

import { getConditionNameValue } from "./utils";

interface RuleConditionNameProps {
  conditionIndex: number;
  disabled: boolean;
  updateCondition: (index: number, value: Condition) => void;
  isConditionTypeSelected: (conditionType: string) => boolean;
}

export const RuleConditionName = ({
  conditionIndex,
  disabled,
  updateCondition,
  isConditionTypeSelected,
}: RuleConditionNameProps) => {
  const { watch } = useFormContext<Rule>();
  const { discountType } = useDiscountRulesContext();
  const { conditionNameOptions } = useConditionNameOptions(discountType);

  const ruleConditionNameFieldName = `conditions.${conditionIndex}.id` as const;
  const { field: nameField } = useController<
    Rule,
    typeof ruleConditionNameFieldName
  >({
    name: ruleConditionNameFieldName,
  });
  const condition = watch(`conditions.${conditionIndex}`);

  const filteredConditionLeftOptions = conditionNameOptions.filter(
    condition => !isConditionTypeSelected(condition.value),
  );

  return (
    <Combobox
      value={getConditionNameValue(nameField.value, conditionNameOptions)}
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
