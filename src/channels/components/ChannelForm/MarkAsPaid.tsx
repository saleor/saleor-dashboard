import { MarkAsPaidStrategyEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { TriangleAlert } from "lucide-react";
import { FormattedMessage } from "react-intl";

import { ChannelSettingRadioGroup } from "./ChannelSettingRadioGroup";
import { messages } from "./messages";

interface MarkAsPaidProps {
  value: MarkAsPaidStrategyEnum;
  onValueChange: (value: MarkAsPaidStrategyEnum) => void;
  disabled?: boolean;
}

const legacyMarkerIconSize = 12;

export const MarkAsPaid = ({ value, onValueChange, disabled }: MarkAsPaidProps) => (
  <ChannelSettingRadioGroup
    testId="order-settings-mark-as-paid"
    name="markAsPaidStrategy"
    title={<FormattedMessage {...messages.markAsPaid} />}
    description={<FormattedMessage {...messages.markAsPaidDescription} />}
    value={value}
    onValueChange={onValueChange}
    disabled={disabled}
    options={[
      {
        value: MarkAsPaidStrategyEnum.TRANSACTION_FLOW,
        label: <FormattedMessage {...messages.markAsPaidTransactionLabel} />,
        description: <FormattedMessage {...messages.markAsPaidTransactionDescription} />,
        badge: (
          <Text size={3} color="default2" as="span" data-test-id="mark-as-paid-recommended-badge">
            (<FormattedMessage {...messages.markAsPaidRecommendedBadge} />)
          </Text>
        ),
      },
      {
        value: MarkAsPaidStrategyEnum.PAYMENT_FLOW,
        label: <FormattedMessage {...messages.markAsPaidPaymentLabel} />,
        description: <FormattedMessage {...messages.markAsPaidPaymentDescription} />,
        badge: (
          <Box
            as="span"
            display="inline-flex"
            alignItems="center"
            gap={1}
            color="default2"
            data-test-id="mark-as-paid-legacy-badge"
          >
            <Box as="span" display="inline-flex" alignItems="center">
              <Text size={3} color="default2" as="span">
                {"("}
              </Text>
              <TriangleAlert size={legacyMarkerIconSize} strokeWidth={2} aria-hidden />
            </Box>
            <Text size={3} color="default2" as="span">
              <FormattedMessage {...messages.markAsPaidLegacyBadge} />
              {")"}
            </Text>
          </Box>
        ),
      },
    ]}
  />
);
