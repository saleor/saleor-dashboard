import { useConditionNames } from "@dashboard/discounts/components/DiscountRules/componenets/RuleForm/components/RuleConditionName/hooks/useConditionNames";
import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context/consumer";
import { createEmptyCodition, Rule } from "@dashboard/discounts/models";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "../../../../messages";
import { RuleConditionRow } from "../RuleConditionRow";
import { AddConditionsSection } from "./components/AddConditionsSection";
import { NestedConditionsWarning } from "./components/NestedConditionsWarning";

interface RuleConditionsProps {
  hasSelectedChannels: boolean;
  openPlayground: () => void;
}

export const RuleConditions = ({
  hasSelectedChannels,
  openPlayground,
}: RuleConditionsProps) => {
  const intl = useIntl();
  const { discountType, disabled } = useDiscountRulesContext();
  const conditionNames = useConditionNames(discountType);

  const { watch } = useFormContext<Rule>();

  const { append, remove, update, fields } = useFieldArray<Rule, "conditions">({
    name: "conditions",
  });

  const conditionsList = watch("conditions");
  const hasPredicateNestedConditions = watch("hasPredicateNestedConditions");

  const allConditionsSelected = conditionsList.length === conditionNames.length;

  const isConditionNameSelected = (conditionType: string) =>
    conditionsList.some(condition => condition.id === conditionType);

  if (hasPredicateNestedConditions) {
    return (
      <NestedConditionsWarning
        disabled={disabled}
        openPlayground={openPlayground}
      />
    );
  }

  if (!hasSelectedChannels) {
    return (
      <Box display="flex" flexDirection="column" gap={4}>
        <Text>{intl.formatMessage(messages.conditions)}</Text>
        <Text size={2} color="default2">
          {intl.formatMessage(messages.noChannelsSelected)}
        </Text>
      </Box>
    );
  }

  if (hasSelectedChannels && !conditionsList.length) {
    return (
      <AddConditionsSection
        disabled={disabled}
        addCondition={() => append(createEmptyCodition())}
      />
    );
  }

  return (
    <Box
      data-test-id="conditions-section"
      display="flex"
      flexDirection="column"
      gap={4}
    >
      <Text>{intl.formatMessage(messages.conditions)}</Text>

      <Box display="flex" flexDirection="column" gap={2}>
        {fields.map((condition, conditionIndex) => (
          <RuleConditionRow
            isConditionTypeSelected={isConditionNameSelected}
            key={condition.id || conditionIndex}
            conditionIndex={conditionIndex}
            updateCondition={update}
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
          alignSelf="start"
          disabled={disabled}
          onClick={() => append(createEmptyCodition())}
          data-test-id="add-another-condition-button"
        >
          <FormattedMessage defaultMessage="Add condition" id="fg8dzN" />
        </Button>
      )}
    </Box>
  );
};
