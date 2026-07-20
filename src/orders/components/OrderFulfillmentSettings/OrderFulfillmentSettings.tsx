import { SettingsSection } from "@dashboard/components/Settings/SettingsSection";
import { SettingsToggleRow } from "@dashboard/components/Settings/SettingsToggleRow";
import { settingsHashes } from "@dashboard/configuration/settingsCatalog/hashes";
import { type ChangeEvent } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type OrderSettingsFormData } from "../OrderSettingsPage/types";

interface OrderFulfillmentSettingsProps {
  data: OrderSettingsFormData;
  disabled: boolean;
  onChange: (event: ChangeEvent<any>) => void;
}

const OrderFulfillmentSettings = ({ data, disabled, onChange }: OrderFulfillmentSettingsProps) => {
  const intl = useIntl();

  const handleToggle = (name: keyof OrderSettingsFormData, value: boolean) => {
    onChange({ target: { name, value } } as ChangeEvent<any>);
  };

  return (
    <SettingsSection
      id={settingsHashes.ordersFulfillment}
      data-test-id="order-fulfillment-settings"
      ownership="shop"
      title={intl.formatMessage({
        id: "G3ay2p",
        defaultMessage: "Fulfillment settings",
        description: "section header",
      })}
      description={
        <FormattedMessage
          id="n/iFou"
          defaultMessage="These settings apply store-wide (shop settings), not per channel."
          description="ownership hint for shop fulfillment settings"
        />
      }
    >
      <SettingsToggleRow
        id={settingsHashes.ordersFulfillmentAutoApprove}
        name="fulfillmentAutoApprove"
        title={
          <FormattedMessage
            id="05hqq6"
            defaultMessage="Automatically approve all fulfillments"
            description="checkbox label"
          />
        }
        description={
          <FormattedMessage
            id="XwQQ1f"
            defaultMessage="All fulfillments will be automatically approved"
            description="checkbox label description"
          />
        }
        checked={data.fulfillmentAutoApprove}
        disabled={disabled}
        onCheckedChange={value => handleToggle("fulfillmentAutoApprove", value)}
        data-test-id="fulfillment-auto-approve-checkbox"
      />
      <SettingsToggleRow
        id={settingsHashes.ordersFulfillmentAllowUnpaid}
        name="fulfillmentAllowUnpaid"
        title={
          <FormattedMessage
            id="2MKkgX"
            defaultMessage="Allow fulfillment without payment"
            description="checkbox label"
          />
        }
        description={
          <FormattedMessage
            id="l9ETHu"
            defaultMessage="You will be able to fulfill products without capturing payment for the order."
            description="checkbox label description"
          />
        }
        checked={data.fulfillmentAllowUnpaid}
        disabled={disabled}
        onCheckedChange={value => handleToggle("fulfillmentAllowUnpaid", value)}
        data-test-id="fulfillment-allow-unpaid-checkbox"
      />
    </SettingsSection>
  );
};

OrderFulfillmentSettings.displayName = "OrderFulfillmentSettings";
export default OrderFulfillmentSettings;
