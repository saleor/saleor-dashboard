import { Multiselect } from "@dashboard/components/Combobox";
import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context/consumer";
import { Rule } from "@dashboard/discounts/models";
import { Box, Input, Option, RangeInput } from "@saleor/macaw-ui-next";
import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { FormattedMessage } from "react-intl";

interface RuleConditionValuesProps {
  conditionIndex: number;
  disabled: boolean;
}

export const RuleConditionValues = ({
  conditionIndex,
  disabled,
}: RuleConditionValuesProps) => {
  const { watch } = useFormContext<Rule>();
  const condition = watch(`conditions.${conditionIndex}`);

  const { getConditionValuesFetchProps, getConditionTypeByLabel } =
    useDiscountRulesContext();
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
    const fetchProps = getConditionValuesFetchProps(condition.id ?? "");

    if (fetchProps) {
      const { fetch, options, fetchMoreProps } = fetchProps;

      return (
        <Multiselect
          size="medium"
          data-test-id="rule-value"
          value={condition.value as Option[]}
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
        data-test-id="rule-value"
        type="number"
        value={condition.value as string}
        onChange={valuesField.onChange}
        disabled={disabled}
      />
    );
  }

  if (inputType === "price.range" || inputType === "number.range") {
    return (
      <Box display="grid" gap={1}>
        <RangeInput
          data-test-id="rule-value"
          value={condition.value as [string, string]}
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
      data-test-id="rule-value"
      value={(condition.value?.[0] || "") as string}
      onChange={valuesField.onChange}
      onBlur={valuesField.onBlur}
      disabled={disabled}
    />
  );
};
