import { intialConditionValues } from "@dashboard/discounts/components/DiscountCreatePage/initialFormValues";
import { DiscoutFormData } from "@dashboard/discounts/types";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { useIntl } from "react-intl";

import { messages } from "../../../../messages";
import { RuleConditionRow } from "../RuleConditionRow";

interface RuleConditionsProps {
  index: number;
}

export const RuleConditions = ({ index }: RuleConditionsProps) => {
  const intl = useIntl();
  const conditionFieldName = `rules.${index}.conditions` as const;
  const {
    append,
    remove,
    fields: conditions,
  } = useFieldArray<DiscoutFormData, typeof conditionFieldName>({
    name: conditionFieldName,
  });

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Text>{intl.formatMessage(messages.conditions)}</Text>

      <Box display="flex" flexDirection="column" gap={4}>
        {conditions.map((condition, conditionIndex) => (
          <RuleConditionRow
            key={condition.type}
            ruleIndex={index}
            conditionIndex={conditionIndex}
            onRemove={() => {
              remove(conditionIndex);
            }}
          />
        ))}
      </Box>

      <Button
        variant="secondary"
        size="small"
        alignSelf="end"
        onClick={() => append({ ...intialConditionValues })}
      >
        Add condition
      </Button>
    </Box>
  );
};
