import { intialConditionValues } from "@dashboard/discounts/components/DiscountCreatePage/initialFormValues";
import { ConditionType, DiscoutFormData } from "@dashboard/discounts/types";
import { FetchOptions } from "@dashboard/discounts/views/DiscountCreate/hooks/useOptionsFetch";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { useIntl } from "react-intl";

import { messages } from "../../../../messages";
import { RuleConditionRow } from "../RuleConditionRow";
import { initialDiscountConditionType } from "../RuleConditionRow/const";

interface RuleConditionsProps {
  index: number;
  fetchOptions: (type: ConditionType) => FetchOptions;
}

export const RuleConditions = ({
  index,
  fetchOptions,
}: RuleConditionsProps) => {
  const intl = useIntl();
  const conditionFieldName = `rules.${index}.conditions` as const;
  const {
    append,
    remove,
    fields: conditions,
  } = useFieldArray<DiscoutFormData, typeof conditionFieldName>({
    name: conditionFieldName,
  });

  const allConditionsSelected =
    conditions.length === initialDiscountConditionType.length;

  const isConditionTypeSelected = (conditionType: string) =>
    conditions.some(condition => condition.type === conditionType);

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Text>{intl.formatMessage(messages.conditions)}</Text>

      <Box display="flex" flexDirection="column" gap={4}>
        {conditions.map((condition, conditionIndex) => (
          <RuleConditionRow
            fetchOptions={fetchOptions}
            isConditionTypeSelected={isConditionTypeSelected}
            key={condition.id}
            ruleIndex={index}
            conditionIndex={conditionIndex}
            onRemove={() => {
              remove(conditionIndex);
            }}
          />
        ))}
      </Box>

      {!allConditionsSelected && (
        <Button
          variant="secondary"
          size="small"
          alignSelf="end"
          onClick={() => append({ ...intialConditionValues })}
        >
          Add condition
        </Button>
      )}
    </Box>
  );
};
