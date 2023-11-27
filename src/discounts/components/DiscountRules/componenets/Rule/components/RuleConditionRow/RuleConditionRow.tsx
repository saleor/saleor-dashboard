import { Combobox, Multiselect } from "@dashboard/components/Combobox";
import { DiscoutFormData } from "@dashboard/discounts/types";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import { Box, Button, Option, RemoveIcon, Select } from "@saleor/macaw-ui-next";
import React from "react";
import { useController } from "react-hook-form";

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
  ruleIndex: number;
  conditionIndex: number;
  onRemove: () => void;
  fetchOptions: FetchOptions;
  isConditionTypeSelected: (conditionType: string) => boolean;
}

export const RuleConditionRow = ({
  ruleIndex,
  conditionIndex,
  onRemove,
  fetchOptions,
  isConditionTypeSelected,
  disabled = false,
}: DiscountConditionRowProps) => {
  const ruleConditionTypeFieldName =
    `rules.${ruleIndex}.conditions.${conditionIndex}.type` as const;
  const { field: typeField } = useController<
    DiscoutFormData,
    typeof ruleConditionTypeFieldName
  >({
    name: ruleConditionTypeFieldName,
  });

  const ruleConditionValuesFieldName =
    `rules.${ruleIndex}.conditions.${conditionIndex}.values` as const;
  const { field: valuesField } = useController<
    DiscoutFormData,
    typeof ruleConditionValuesFieldName
  >({
    name: ruleConditionValuesFieldName,
  });

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
          onChange={typeField.onChange}
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
          alwaysFetchOnFocus
          value={valuesField.value}
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
