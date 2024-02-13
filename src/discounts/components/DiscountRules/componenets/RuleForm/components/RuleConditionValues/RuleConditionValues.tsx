import { useCondtionTypes } from "@dashboard/discounts/components/DiscountRules/componenets/RuleForm/components/RuleConditionType/useConditionTypes";
import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { Rule } from "@dashboard/discounts/models";
import { Box, Input, RangeInput } from "@saleor/macaw-ui-next";
import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { RuleConditionDynamicSelect } from "../RuleConditionDynamicSelect";

interface RuleConditionValuesProps {
  conditionIndex: number;
}

export const RuleConditionValues = ({
  conditionIndex,
}: RuleConditionValuesProps) => {
  const { watch } = useFormContext<Rule>();
  const { getConditionTypeByLabel } = useCondtionTypes();
  const { disabled } = useDiscountRulesContext();

  const condition = watch(`conditions.${conditionIndex}`);

  const inputType = getConditionTypeByLabel(
    condition.id ?? "",
    condition.type ?? "",
  );

  const ruleConditionValuesFieldName =
    `conditions.${conditionIndex}.value` as const;

  const { field: valuesField } = useController<
    Rule,
    typeof ruleConditionValuesFieldName
  >({
    name: ruleConditionValuesFieldName,
  });

  if (inputType === "multiselect") {
    return (
      <RuleConditionDynamicSelect
        condition={condition}
        conditionIndex={conditionIndex}
        disabled={disabled}
      />
    );
  }

  if (inputType === "number" || inputType === "price") {
    return (
      <Input
        data-test-id={`condition-value-${conditionIndex}`}
        type="number"
        value={condition.value as string}
        onChange={valuesField.onChange}
        disabled={disabled}
      />
    );
  }

  if (inputType === "price.range" || inputType === "number.range") {
    return (
      <Box display="flex" gap={2} alignItems="center">
        <RangeInput
          data-test-id={`condition-value-${conditionIndex}`}
          value={condition.value as [string, string]}
          onChange={valuesField.onChange}
          type="number"
          disabled={disabled}
          width="100%"
        >
          <FormattedMessage defaultMessage="and" id="3mvL2Q" />
        </RangeInput>
      </Box>
    );
  }

  return (
    <Input
      size="medium"
      data-test-id={`condition-value-${conditionIndex}`}
      value={(condition.value?.[0] || "") as string}
      onChange={valuesField.onChange}
      onBlur={valuesField.onBlur}
      disabled={disabled}
    />
  );
};
