import { TransactionFlowStrategyEnum } from "@dashboard/graphql";
import { FormattedMessage } from "react-intl";

import { ChannelSettingRadioGroup } from "./ChannelSettingRadioGroup";
import { messages } from "./messages";

interface DefaultTransactionFlowStrategyProps {
  value: TransactionFlowStrategyEnum;
  onValueChange: (value: TransactionFlowStrategyEnum) => void;
  disabled?: boolean;
}

export const DefaultTransactionFlowStrategy = ({
  value,
  onValueChange,
  disabled,
}: DefaultTransactionFlowStrategyProps) => (
  <ChannelSettingRadioGroup
    testId="default-transaction-strategy"
    name="defaultTransactionFlowStrategy"
    title={<FormattedMessage {...messages.defaultTransactionFlowStrategyLabel} />}
    description={<FormattedMessage {...messages.defaultTransactionFlowStrategyDescription} />}
    value={value}
    onValueChange={onValueChange}
    disabled={disabled}
    options={[
      {
        value: TransactionFlowStrategyEnum.CHARGE,
        label: <FormattedMessage {...messages.transactionFlowChargeLabel} />,
        description: <FormattedMessage {...messages.transactionFlowChargeDescription} />,
      },
      {
        value: TransactionFlowStrategyEnum.AUTHORIZATION,
        label: <FormattedMessage {...messages.transactionFlowAuthorizeLabel} />,
        description: <FormattedMessage {...messages.transactionFlowAuthorizeDescription} />,
      },
    ]}
  />
);
