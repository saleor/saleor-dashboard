import { DashboardCard } from "@dashboard/components/Card";
import FormSpacer from "@dashboard/components/FormSpacer";
import { ShopErrorFragment } from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import { TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { SiteSettingsPageFormData } from "../SiteSettingsPage";
import { messages } from "./messages";

interface SiteCheckoutSettingsCardProps {
  data: SiteSettingsPageFormData;
  errors: ShopErrorFragment[];
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const SiteCheckoutSettingsCard = ({
  data,
  disabled,
  errors,
  onChange,
}: SiteCheckoutSettingsCardProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(
    [
      "reserveStockDurationAuthenticatedUser",
      "reserveStockDurationAnonymousUser",
      "limitQuantityPerCheckout",
    ],
    errors,
  );

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(messages.reservedStock)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Text fontSize={3}>
          <FormattedMessage {...messages.reservedStockDescription} />
        </Text>
        <FormSpacer />
        <TextField
          data-test-id="reserve-stock-duration-for-auth-user-input"
          disabled={disabled}
          error={!!formErrors.reserveStockDurationAuthenticatedUser}
          type="number"
          fullWidth
          name="reserveStockDurationAuthenticatedUser"
          label={intl.formatMessage(messages.stockReservationForAuthenticatedUser)}
          helperText={intl.formatMessage(messages.stockWillNotBeReserved)}
          value={
            data.reserveStockDurationAuthenticatedUser
              ? String(data.reserveStockDurationAuthenticatedUser)
              : ""
          }
          onChange={onChange}
          InputProps={{
            inputProps: {
              autoComplete: "none",
            },
          }}
        />
        <FormSpacer />
        <TextField
          data-test-id="reserve-stock-duration-for-anon-user-input"
          disabled={disabled}
          error={!!formErrors.reserveStockDurationAnonymousUser}
          type="number"
          fullWidth
          name="reserveStockDurationAnonymousUser"
          label={intl.formatMessage(messages.stockReservationForAnonymousUser)}
          helperText={intl.formatMessage(messages.stockWillNotBeReserved)}
          value={
            data.reserveStockDurationAnonymousUser
              ? String(data.reserveStockDurationAnonymousUser)
              : ""
          }
          onChange={onChange}
          InputProps={{
            inputProps: {
              autoComplete: "none",
            },
          }}
        />
      </DashboardCard.Content>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(messages.checkoutLimits)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <TextField
          data-test-id="checkout-limits-input"
          disabled={disabled}
          error={!!formErrors.reserveStockDurationAuthenticatedUser}
          type="number"
          fullWidth
          name="limitQuantityPerCheckout"
          label={intl.formatMessage(messages.checkoutLineLimit)}
          helperText={intl.formatMessage(messages.checkoutLimitsDescription)}
          value={data.limitQuantityPerCheckout ? String(data.limitQuantityPerCheckout) : ""}
          onChange={onChange}
          InputProps={{
            inputProps: {
              autoComplete: "none",
              min: 0,
            },
          }}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

SiteCheckoutSettingsCard.displayName = "SiteCheckoutSettingsCard";
export default SiteCheckoutSettingsCard;
