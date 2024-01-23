import { Multiselect } from "@dashboard/components/Combobox";
import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context/consumer";
import { Rule } from "@dashboard/discounts/models";
import { Box, Input, RangeInput } from "@saleor/macaw-ui-next";
import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { FormattedMessage } from "react-intl";

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

  const { getFetchProps, getConditionInputTypeByLabel } =
    useDiscountRulesContext();
  const inputType = getConditionInputTypeByLabel(
    condition.name,
    condition.type,
  );

  const ruleConditionValuesFieldName =
    `conditions.${conditionIndex}.values` as const;

  const { field: valuesField } = useController<
    Rule,
    typeof ruleConditionValuesFieldName
  >({
    name: ruleConditionValuesFieldName,
  });

  if (inputType === "multiselect") {
    const fetchProps = getFetchProps(condition.name);

    if (fetchProps) {
      const { fetch, options, fetchMoreProps } = fetchProps;

      return (
        <Multiselect
          size="medium"
          data-test-id="rule-values"
          value={condition.values as any}
          fetchOptions={fetch}
          fetchMore={fetchMoreProps}
          options={options ?? []}
          onChange={valuesField.onChange}
          onBlur={valuesField.onBlur}
          disabled={disabled}
        >
          <Multiselect.NoOptions size="small" padding={1}>
            <FormattedMessage
              defaultMessage="No options to select"
              id="xTyg+p"
            />
          </Multiselect.NoOptions>
        </Multiselect>
      );
    }
  }

  if (inputType === "number" || inputType === "price") {
    return (
      <Input
        type="number"
        value={condition.values as string}
        onChange={valuesField.onChange}
        disabled={disabled}
      />
    );
  }

  if (inputType === "price.range" || inputType === "number.range") {
    return (
      <Box display="grid" gap={1}>
        <RangeInput
          value={condition.values as [string, string]}
          onChange={valuesField.onChange}
          type="number"
          disabled={disabled}
          width="100%"
        />
      </Box>
    );
  }

  return (
    <Input
      size="medium"
      data-test-id="rule-values"
      value={(condition.values?.[0] || "") as string}
      onChange={valuesField.onChange}
      onBlur={valuesField.onBlur}
      disabled={disabled}
    />
  );
};
