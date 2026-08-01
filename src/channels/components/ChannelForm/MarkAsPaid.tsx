import { MarkAsPaidStrategyEnum } from "@dashboard/graphql";
import { FormattedMessage } from "react-intl";

import { ChannelSettingRadioGroup } from "./ChannelSettingRadioGroup";
import { messages } from "./messages";

interface MarkAsPaidProps {
  value: MarkAsPaidStrategyEnum;
  onValueChange: (value: MarkAsPaidStrategyEnum) => void;
  disabled?: boolean;
}

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
      },
      {
        value: MarkAsPaidStrategyEnum.PAYMENT_FLOW,
        label: <FormattedMessage {...messages.markAsPaidPaymentLabel} />,
        description: <FormattedMessage {...messages.markAsPaidPaymentDescription} />,
      },
    ]}
  />
);
