import { SettingsFieldStack } from "@dashboard/components/Settings/SettingsFieldStack";
import { SettingsSection } from "@dashboard/components/Settings/SettingsSection";
import { settingsHashes } from "@dashboard/configuration/settingsCatalog/hashes";
import { Box, Input } from "@saleor/macaw-ui-next";
import { type ChangeEvent } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type OrderSettingsFormData } from "../OrderSettingsPage/types";
import { messages } from "./messages";

interface OrderCheckoutStockSettingsProps {
  data: OrderSettingsFormData;
  disabled: boolean;
  onChange: (event: ChangeEvent<any>) => void;
}

export const OrderCheckoutStockSettings = ({
  data,
  disabled,
  onChange,
}: OrderCheckoutStockSettingsProps): JSX.Element => {
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
          <Input
            data-test-id="reserve-stock-duration-for-auth-user-input"
            disabled={disabled}
            type="number"
            width="100%"
            name="reserveStockDurationAuthenticatedUser"
            label={intl.formatMessage(messages.stockReservationForAuthenticatedUser)}
            helperText={intl.formatMessage(messages.stockWillNotBeReserved)}
            value={
              data.reserveStockDurationAuthenticatedUser
                ? String(data.reserveStockDurationAuthenticatedUser)
                : ""
            }
            onChange={onChange}
          />
          <Input
            data-test-id="reserve-stock-duration-for-anon-user-input"
            disabled={disabled}
            type="number"
            width="100%"
            name="reserveStockDurationAnonymousUser"
            label={intl.formatMessage(messages.stockReservationForAnonymousUser)}
            helperText={intl.formatMessage(messages.stockWillNotBeReserved)}
            value={
              data.reserveStockDurationAnonymousUser
                ? String(data.reserveStockDurationAnonymousUser)
                : ""
            }
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
