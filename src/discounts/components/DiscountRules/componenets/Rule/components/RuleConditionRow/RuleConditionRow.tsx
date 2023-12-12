import { Combobox, Multiselect } from "@dashboard/components/Combobox";
import { Condition, Rule } from "@dashboard/discounts/types";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import { Box, Button, Option, RemoveIcon, Select } from "@saleor/macaw-ui-next";
import React from "react";
import { useController, useFormContext } from "react-hook-form";

import { RuleInputWrapper } from "../RuleInputWrapper/RuleInputWrapper";
import { initialDiscountConditionType } from "./initialDiscountConditionType";
import { getConditionTypeValue } from "./utils";

export interface FetchOptions {
  fetch: (query: string) => void;
  fetchMoreProps?: ReturnType<typeof getSearchFetchMoreProps>;
  options: Option[];
}
interface DiscountConditionRowProps {
  disabled?: boolean;
  conditionIndex: number;
  onRemove: () => void;
  updateCondition: (index: number, value: Condition) => void;
  fetchOptions: FetchOptions | undefined;
  isConditionTypeSelected: (conditionType: string) => boolean;
}

export const RuleConditionRow = ({
  conditionIndex,
  onRemove,
  fetchOptions,
  isConditionTypeSelected,
  updateCondition,
  disabled = false,
}: DiscountConditionRowProps) => {
  const ruleConditionTypeFieldName =
    `conditions.${conditionIndex}.type` as const;
  const { field: typeField } = useController<
    Rule,
    typeof ruleConditionTypeFieldName
  >({
    name: ruleConditionTypeFieldName,
  });

  const ruleConditionValuesFieldName =
    `conditions.${conditionIndex}.values` as const;
  const { field: valuesField } = useController<
    Rule,
    typeof ruleConditionValuesFieldName
  >({
    name: ruleConditionValuesFieldName,
  });

  const { watch } = useFormContext<Rule>();
  const condition = watch(`conditions.${conditionIndex}`);

  const { fetch = () => {}, fetchMoreProps, options } = fetchOptions || {};

  const discountConditionType = initialDiscountConditionType.filter(
    condition => !isConditionTypeSelected(condition.value),
  );

  return (
    <Box
      display="grid"
      gap={0.5}
      __gridTemplateColumns="2fr 1fr 3fr auto"
      placeItems="center"
      alignItems="start"
    >
      <RuleInputWrapper>
        <Combobox
          value={getConditionTypeValue(
            typeField.value,
            initialDiscountConditionType,
          )}
          fetchOptions={() => {}}
          options={discountConditionType}
          onChange={e => {
            updateCondition(conditionIndex, { ...condition, values: [] });
            typeField.onChange(e.target.value);
          }}
          data-test-id="rule-type"
          onBlur={typeField.onBlur}
          disabled={disabled}
        />
      </RuleInputWrapper>

      <RuleInputWrapper>
        <Select
          value={"is"}
          size="small"
          options={[
            {
              value: "is",
              label: "is",
            },
          ]}
          onChange={() => {}}
          disabled={disabled}
        />
      </RuleInputWrapper>

      <RuleInputWrapper>
        <Multiselect
          data-test-id="rule-values"
          value={condition.values}
          fetchOptions={fetch}
          fetchMore={fetchMoreProps}
          options={options ?? []}
          onChange={valuesField.onChange}
          onBlur={valuesField.onBlur}
          disabled={disabled}
        />
      </RuleInputWrapper>

      <Button variant="tertiary" icon={<RemoveIcon />} onClick={onRemove} />
    </Box>
  );
};
