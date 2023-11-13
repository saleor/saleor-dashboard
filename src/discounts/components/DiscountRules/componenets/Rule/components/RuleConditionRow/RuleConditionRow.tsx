import { Combobox, Multiselect } from "@dashboard/components/Combobox";
import { Box, Button, RemoveIcon, Select } from "@saleor/macaw-ui-next";
import React from "react";

import { DiscountCondition } from "../../../../types";
import { discountConditionTypes } from "./const";

interface DiscountConditionRowProps {
  condition: DiscountCondition;
  onRemove: () => void;
}

export const RuleConditionRow = ({
  condition,
  onRemove,
}: DiscountConditionRowProps) => {
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
          label: condition.type,
          value: condition.type,
        }}
        fetchOptions={() => {}}
        options={discountConditionTypes}
        onChange={() => {}}
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
        value={condition.values}
        fetchOptions={() => {}}
        options={[]}
        onChange={() => {}}
      />

      <Button variant="tertiary" icon={<RemoveIcon />} onClick={onRemove} />
    </Box>
  );
};
