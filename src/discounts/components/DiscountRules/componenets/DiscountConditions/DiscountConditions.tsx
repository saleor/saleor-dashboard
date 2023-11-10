import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";

import { DiscountCondition } from "../../types";
import { DiscountConditionRow } from "../DiscountConditonRow";

export const DiscountConditions = () => {
  const [conditions, setConditions] = useState<DiscountCondition[]>([
    { type: "", values: [] },
  ]);
  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Text>Conditions</Text>

      <Box display="flex" flexDirection="column" gap={4}>
        {conditions.map(condition => (
          <DiscountConditionRow
            key={condition.type}
            condition={condition}
            onRemove={() => {
              setConditions(conditions => conditions.slice(1));
            }}
          />
        ))}
      </Box>

      <Button
        variant="secondary"
        size="small"
        alignSelf="end"
        onClick={() =>
          setConditions(conditions => [...conditions, { type: "", values: [] }])
        }
      >
        Add condition
      </Button>
    </Box>
  );
};
