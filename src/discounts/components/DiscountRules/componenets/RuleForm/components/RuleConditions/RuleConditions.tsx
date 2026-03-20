import { ModalSectionHeader } from "@dashboard/components/Modal/ModalSectionHeader";
import { useConditionNames } from "@dashboard/discounts/components/DiscountRules/componenets/RuleForm/components/RuleConditionName/hooks/useConditionNames";
import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context/consumer";
import { createEmptyCodition, type Rule } from "@dashboard/discounts/models";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
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
}: RuleConditionsProps): JSX.Element => {
  const intl = useIntl();
  const { discountType, disabled } = useDiscountRulesContext();
  const conditionNames = useConditionNames(discountType);
  const { watch } = useFormContext<Rule>();
  const { prepend, remove, update, fields } = useFieldArray<Rule, "conditions">({
    name: "conditions",
  });
  const conditionsList = watch("conditions");
  const hasPredicateNestedConditions = watch("hasPredicateNestedConditions");
  const allConditionsSelected = conditionsList.length === conditionNames.length;
  const isConditionNameSelected = (conditionType: string): boolean =>
    conditionsList.some(condition => condition.id === conditionType);

  if (hasPredicateNestedConditions) {
    return <NestedConditionsWarning disabled={disabled} openPlayground={openPlayground} />;
  }

  if (!hasSelectedChannels) {
    return (
      <Box display="flex" flexDirection="column" gap={4}>
        <ModalSectionHeader>{intl.formatMessage(messages.conditions)}</ModalSectionHeader>
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
        addCondition={() => prepend(createEmptyCodition())}
      />
    );
  }

  return (
    <Box data-test-id="conditions-section" display="flex" flexDirection="column" gap={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
        <ModalSectionHeader>{intl.formatMessage(messages.conditions)}</ModalSectionHeader>
        <Button
          variant="secondary"
          size="small"
          disabled={disabled || allConditionsSelected}
          onClick={() => prepend(createEmptyCodition())}
          data-test-id="add-condition-button"
        >
          <FormattedMessage defaultMessage="Add condition" id="fg8dzN" />
        </Button>
      </Box>
      <Box
        __height="1px"
        __backgroundColor="var(--mu-colors-border-default1)"
        __marginLeft="calc(-1 * var(--mu-spacing-4))"
        __marginRight="calc(-1 * var(--mu-spacing-4))"
      />

      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        __maxHeight="300px"
        overflowY="auto"
        __paddingRight="var(--mu-spacing-2)"
        __marginRight="calc(-1 * var(--mu-spacing-2))"
      >
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
    </Box>
  );
};
