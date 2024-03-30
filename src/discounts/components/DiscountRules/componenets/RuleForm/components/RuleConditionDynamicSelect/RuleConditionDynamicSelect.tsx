import { Multiselect } from "@dashboard/components/Combobox";
import { useCondtionValues } from "@dashboard/discounts/components/DiscountRules/componenets/RuleForm/components/RuleConditionValues/hooks/useCondtionValues";
import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { Condition, Rule } from "@dashboard/discounts/models";
import { Option } from "@saleor/macaw-ui-next";
import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { FormattedMessage } from "react-intl";

interface RuleConditionDynamicSelectProps {
  condition: Condition;
  conditionIndex: number;
  disabled: boolean;
}

export const RuleConditionDynamicSelect = ({
  condition,
  conditionIndex,
  disabled,
}: RuleConditionDynamicSelectProps) => {
  const { watch } = useFormContext<Rule>();
  const { channels } = useDiscountRulesContext();

  const channel = watch("channel");

  const ruleConditionValuesFieldName =
    `conditions.${conditionIndex}.value` as const;
  const { field: valuesField } = useController<
    Rule,
    typeof ruleConditionValuesFieldName
  >({
    name: ruleConditionValuesFieldName,
  });

  const channelSlug =
    channels?.find(chan => chan.id === channel?.value)?.slug ?? "";

  const { getConditionValuesFetchProps } = useCondtionValues(
    channelSlug,
    condition.id,
  );

  const fetchProps = getConditionValuesFetchProps(condition.id ?? "");

  if (fetchProps) {
    const { fetch, options, fetchMoreProps } = fetchProps;

    return (
      <Multiselect
        size="medium"
        data-test-id={`condition-value-${conditionIndex}`}
        value={condition.value as Option[]}
        fetchOptions={fetch}
        fetchMore={fetchMoreProps}
        options={options ?? []}
        onChange={valuesField.onChange}
        onBlur={valuesField.onBlur}
        disabled={disabled}
      >
        <Multiselect.NoOptions size={3} padding={1}>
          <FormattedMessage defaultMessage="No options to select" id="xTyg+p" />
        </Multiselect.NoOptions>
      </Multiselect>
    );
  }

  return null;
};
