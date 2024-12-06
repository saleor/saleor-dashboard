import { messages } from "@dashboard/discounts/components/DiscountRules/messages";
import { Box, Button, Text, WarningIcon } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

interface NestedConditionsWarningProps {
  disabled: boolean;
  openPlayground: () => void;
}

export const NestedConditionsWarning = ({
  disabled,
  openPlayground,
}: NestedConditionsWarningProps) => {
  const intl = useIntl();

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Text>{intl.formatMessage(messages.conditions)}</Text>

      <Box display="flex" alignItems="center" gap={2}>
        <WarningIcon color="warning1" />

        <Box display="flex" flexDirection="column">
          <Text size={2} color="default1">
            {intl.formatMessage(messages.noHanldedConditions)}
          </Text>
          <Text size={2} color="default1">
            {intl.formatMessage(messages.noHandledConditionsReminder)}
          </Text>
        </Box>
      </Box>

      <Button
        data-test-id="openPlaygroundButton"
        variant="secondary"
        size="small"
        alignSelf="start"
        disabled={disabled}
        onClick={() => openPlayground()}
      >
        <FormattedMessage defaultMessage="Open playground" id="TVR4E6" />
      </Button>
    </Box>
  );
};
