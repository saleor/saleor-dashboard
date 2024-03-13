import { messages } from "@dashboard/discounts/components/DiscountRules/messages";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface AddConditionsSectionProps {
  disabled: boolean;
  addCondition: () => void;
}

export const AddConditionsSection = ({
  disabled,
  addCondition,
}: AddConditionsSectionProps) => {
  const intl = useIntl();

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Text>{intl.formatMessage(messages.conditions)}</Text>
      <Text typeSize={2} color="default2">
        {intl.formatMessage(messages.noConditonsCreate)}
      </Text>

      <Button
        variant="secondary"
        size="small"
        alignSelf="start"
        disabled={disabled}
        onClick={addCondition}
        data-test-id="add-first-condition-button"
      >
        <FormattedMessage defaultMessage="Add condition" id="fg8dzN" />
      </Button>
    </Box>
  );
};
