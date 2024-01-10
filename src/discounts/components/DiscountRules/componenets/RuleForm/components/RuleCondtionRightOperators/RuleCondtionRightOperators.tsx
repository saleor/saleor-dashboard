import { Multiselect } from "@dashboard/components/Combobox";
import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context/consumer";
import { Rule } from "@dashboard/discounts/models";
import { Input } from "@saleor/macaw-ui-next";
import React from "react";
import { useController, useFormContext } from "react-hook-form";

interface RuleCondtionRightOperatorsProps {
  conditionIndex: number;
  disabled: boolean;
}

export const RuleCondtionRightOperators = ({
  conditionIndex,
  disabled,
}: RuleCondtionRightOperatorsProps) => {
  const { watch } = useFormContext<Rule>();
  const condition = watch(`conditions.${conditionIndex}`);

  const { getFetchProps } = useDiscountRulesContext();

  const ruleConditionValuesFieldName =
    `conditions.${conditionIndex}.values` as const;

  const { field: valuesField } = useController<
    Rule,
    typeof ruleConditionValuesFieldName
  >({
    name: ruleConditionValuesFieldName,
  });

  if (Array.isArray(condition.values)) {
    const fetchProps = getFetchProps(condition.name);

    if (fetchProps) {
      const { fetch, options, fetchMoreProps } = fetchProps;

      return (
        <Multiselect
          size="medium"
          data-test-id="rule-values"
          value={condition.values}
          fetchOptions={fetch}
          fetchMore={fetchMoreProps}
          options={options ?? []}
          onChange={valuesField.onChange}
          onBlur={valuesField.onBlur}
          disabled={disabled}
        />
      );
    }
  }

  return (
    <Input
      size="medium"
      data-test-id="rule-values"
      value={condition.values[0] as string}
      onChange={valuesField.onChange}
      onBlur={valuesField.onBlur}
      disabled={disabled}
    />
  );
};
