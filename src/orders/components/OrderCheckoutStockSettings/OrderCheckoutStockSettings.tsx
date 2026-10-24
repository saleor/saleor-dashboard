import { SettingsFieldStack } from "@dashboard/components/Settings/SettingsFieldStack";
import { SettingsSection } from "@dashboard/components/Settings/SettingsSection";
import { settingsHashes } from "@dashboard/configuration/settingsCatalog/hashes";
import { type FormChange } from "@dashboard/hooks/useForm";
import { Box, Checkbox, Input, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type OrderSettingsFormData } from "../OrderSettingsPage/types";
import { messages } from "./messages";

interface OrderCheckoutStockSettingsProps {
  data: OrderSettingsFormData;
  disabled: boolean;
  onChange: FormChange;
}

const DEFAULT_RESERVATION_ANONYMOUS_USER = 200;
const DEFAULT_RESERVATION_AUTHENTICATED_USER = 400;

interface StockReservationFieldProps {
  name: "reserveStockDurationAnonymousUser" | "reserveStockDurationAuthenticatedUser";
  testId: string;
  value: number;
  defaultValue: number;
  checkboxLabel: string;
  inputLabel: string;
  disabled: boolean;
  onChange: FormChange;
}

// Saleor treats 0 as "reservation disabled", so the checkbox maps to 0 / default.
const StockReservationField = ({
  name,
  testId,
  value,
  defaultValue,
  checkboxLabel,
  inputLabel,
  disabled,
  onChange,
}: StockReservationFieldProps): React.ReactNode => {
  // Explicit toggle wins over the derived state, so clearing the input doesn't hide it.
  const [enabledOverride, setEnabledOverride] = useState<boolean | null>(null);
  const enabled = enabledOverride ?? value > 0;

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Checkbox
        data-test-id={`${testId}-checkbox`}
        checked={enabled}
        disabled={disabled}
        onCheckedChange={checked => {
          const isChecked = checked === true;

          setEnabledOverride(isChecked);
          onChange({ target: { name, value: isChecked ? defaultValue : 0 } });
        }}
      >
        <Text size={3}>{checkboxLabel}</Text>
      </Checkbox>
      {enabled && (
        <Input
          data-test-id={`${testId}-input`}
          disabled={disabled}
          type="number"
          width="100%"
          name={name}
          label={inputLabel}
          value={value ? String(value) : ""}
          min={1}
          onChange={event => {
            setEnabledOverride(true);
            onChange(event);
          }}
        />
      )}
    </Box>
  );
};

export const OrderCheckoutStockSettings = ({
  data,
  disabled,
  onChange,
}: OrderCheckoutStockSettingsProps): React.ReactNode => {
  const intl = useIntl();

  return (
    <Box display="flex" flexDirection="column" gap={5}>
      <SettingsSection
        id={settingsHashes.ordersReservedStock}
        data-test-id="order-checkout-stock-settings"
        ownership="shop"
        title={intl.formatMessage(messages.reservedStock)}
        description={<FormattedMessage {...messages.reservedStockDescription} />}
      >
        <SettingsFieldStack>
          <StockReservationField
            name="reserveStockDurationAuthenticatedUser"
            testId="reserve-stock-duration-for-auth-user"
            value={data.reserveStockDurationAuthenticatedUser}
            defaultValue={DEFAULT_RESERVATION_AUTHENTICATED_USER}
            checkboxLabel={intl.formatMessage(messages.enableStockReservationForAuthenticatedUser)}
            inputLabel={intl.formatMessage(messages.stockReservationForAuthenticatedUser)}
            disabled={disabled}
            onChange={onChange}
          />
          <StockReservationField
            name="reserveStockDurationAnonymousUser"
            testId="reserve-stock-duration-for-anon-user"
            value={data.reserveStockDurationAnonymousUser}
            defaultValue={DEFAULT_RESERVATION_ANONYMOUS_USER}
            checkboxLabel={intl.formatMessage(messages.enableStockReservationForAnonymousUser)}
            inputLabel={intl.formatMessage(messages.stockReservationForAnonymousUser)}
            disabled={disabled}
            onChange={onChange}
          />
        </SettingsFieldStack>
      </SettingsSection>

      <SettingsSection
        id={settingsHashes.ordersCheckoutLimits}
        data-test-id="order-checkout-limits-settings"
        ownership="shop"
        title={intl.formatMessage(messages.checkoutLimits)}
        description={<FormattedMessage {...messages.checkoutLimitsDescription} />}
      >
        <SettingsFieldStack>
          <Input
            data-test-id="checkout-limits-input"
            disabled={disabled}
            type="number"
            width="100%"
            name="limitQuantityPerCheckout"
            label={intl.formatMessage(messages.checkoutLineLimit)}
            value={data.limitQuantityPerCheckout ? String(data.limitQuantityPerCheckout) : ""}
            onChange={onChange}
            min={0}
          />
        </SettingsFieldStack>
      </SettingsSection>
    </Box>
  );
};
