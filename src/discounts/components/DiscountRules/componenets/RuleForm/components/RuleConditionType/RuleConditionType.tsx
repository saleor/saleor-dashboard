import { useCondtionTypes } from "@dashboard/discounts/components/DiscountRules/hooks/useConditionTypes";
import { Rule } from "@dashboard/discounts/models";
import { Select } from "@saleor/macaw-ui-next";
import React from "react";
import { useController, useFormContext } from "react-hook-form";

interface RuleConditionTypeProps {
  disabled: boolean;
  conditionIndex: number;
}

export const RuleConditionType = ({
  disabled,
  conditionIndex,
}: RuleConditionTypeProps) => {
  const { watch } = useFormContext<Rule>();
  const condition = watch(`conditions.${conditionIndex}`);

  const { getConditionTypesOptions } = useCondtionTypes();
  const conditionTypesOptions = getConditionTypesOptions(condition.id ?? "");

  const ruleCondtionTypeFileName = `conditions.${conditionIndex}.type` as const;
  const { field: typeField } = useController<
    Rule,
    typeof ruleCondtionTypeFileName
  >({
    name: ruleCondtionTypeFileName,
  });

  return (
    <Select
      value={typeField.value}
      size="medium"
      options={conditionTypesOptions}
      onChange={typeField.onChange}
      disabled={disabled}
    />
  );
};
