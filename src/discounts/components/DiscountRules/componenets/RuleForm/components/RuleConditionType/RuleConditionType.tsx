import { useCondtionTypes } from "@dashboard/discounts/components/DiscountRules/componenets/RuleForm/components/RuleConditionType/useConditionTypes";
import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { Rule } from "@dashboard/discounts/models";
import { Select } from "@saleor/macaw-ui-next";
import React from "react";
import { useController, useFormContext } from "react-hook-form";

interface RuleConditionTypeProps {
  conditionIndex: number;
}

export const RuleConditionType = ({ conditionIndex }: RuleConditionTypeProps) => {
  const { watch } = useFormContext<Rule>();
  const condition = watch(`conditions.${conditionIndex}`);
  const { disabled } = useDiscountRulesContext();
  const { getConditionTypesOptions } = useCondtionTypes();
  const conditionTypesOptions = getConditionTypesOptions(condition.id ?? "");
  const ruleCondtionTypeFileName = `conditions.${conditionIndex}.type` as const;
  const { field: typeField } = useController<Rule, typeof ruleCondtionTypeFileName>({
    name: ruleCondtionTypeFileName,
  });

  return (
    <Select
      data-test-id={`condition-type-${conditionIndex}`}
      value={typeField.value}
      size="medium"
      options={conditionTypesOptions}
      onChange={typeField.onChange}
      disabled={disabled}
    />
  );
};
