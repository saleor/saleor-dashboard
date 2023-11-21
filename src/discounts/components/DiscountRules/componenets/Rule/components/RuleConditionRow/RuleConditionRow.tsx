import { Combobox, Multiselect } from "@dashboard/components/Combobox";
import { DiscoutFormData } from "@dashboard/discounts/types";
import {
  FetchOptions,
  OptionsType,
} from "@dashboard/discounts/views/DiscountCreate/hooks/useOptionsFetch";
import { Box, Button, RemoveIcon, Select } from "@saleor/macaw-ui-next";
import React from "react";
import { useController } from "react-hook-form";

import { initialDiscountConditionType } from "./const";
import { getConditionTypeValue } from "./utils";

interface DiscountConditionRowProps {
  ruleIndex: number;
  conditionIndex: number;
  onRemove: () => void;
  fetchOptions: (type: OptionsType) => FetchOptions;
  isConditionTypeSelected: (conditionType: string) => boolean;
}

export const RuleConditionRow = ({
  ruleIndex,
  conditionIndex,
  onRemove,
  fetchOptions,
  isConditionTypeSelected,
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

  const {
    fetch = () => {},
    fetchMoreProps,
    options,
  } = fetchOptions(typeField.value as OptionsType) ?? {};

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
      <Combobox
        value={getConditionTypeValue(
          typeField.value,
          initialDiscountConditionType,
        )}
        fetchOptions={() => {}}
        options={discountConditionType}
        onChange={typeField.onChange}
        onBlur={typeField.onBlur}
      />

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
      />

      <Multiselect
        alwaysFetchOnFocus
        value={valuesField.value}
        fetchOptions={fetch}
        fetchMore={fetchMoreProps}
        options={options ?? []}
        onChange={valuesField.onChange}
        onBlur={valuesField.onBlur}
      />

      <Button variant="tertiary" icon={<RemoveIcon />} onClick={onRemove} />
    </Box>
  );
};
