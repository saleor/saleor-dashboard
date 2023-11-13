import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "../../../../messages";
import { DiscountCondition } from "../../../../types";
import { RuleConditionRow } from "../RuleConditionRow";

export const RuleConditions = () => {
  const intl = useIntl();
  const [conditions, setConditions] = useState<DiscountCondition[]>([
    { type: "", values: [] },
  ]);
  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Text>{intl.formatMessage(messages.conditions)}</Text>

      <Box display="flex" flexDirection="column" gap={4}>
        {conditions.map(condition => (
          <RuleConditionRow
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
