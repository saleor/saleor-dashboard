import { Combobox, Multiselect } from "@dashboard/components/Combobox";
import { DiscoutFormData } from "@dashboard/discounts/types";
import { Box, Button, RemoveIcon, Select } from "@saleor/macaw-ui-next";
import React from "react";
import { useController } from "react-hook-form";

import { discountConditionTypes } from "./const";

interface DiscountConditionRowProps {
  ruleIndex: number;
  conditionIndex: number;
  onRemove: () => void;
}

export const RuleConditionRow = ({
  ruleIndex,
  conditionIndex,
  onRemove,
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

  return (
    <Box
      display="grid"
      gap={0.5}
      __gridTemplateColumns="2fr 1fr 3fr auto"
      placeItems="center"
      alignItems="start"
    >
      <Combobox
        value={{
          label: typeField.value,
          value: typeField.value,
        }}
        fetchOptions={() => {}}
        options={discountConditionTypes}
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
        value={valuesField.value}
        fetchOptions={() => {}}
        options={[
          { label: "test", value: "test" },
          { label: "test2", value: "test2" },
        ]}
        onChange={valuesField.onChange}
        onBlur={valuesField.onBlur}
      />

      <Button variant="tertiary" icon={<RemoveIcon />} onClick={onRemove} />
    </Box>
  );
};
