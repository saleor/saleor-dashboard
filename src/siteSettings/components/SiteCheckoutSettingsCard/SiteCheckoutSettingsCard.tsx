import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import { ShopErrorFragment } from "@saleor/graphql";
import { getFormErrors } from "@saleor/utils/errors";
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

const SiteCheckoutSettingsCard: React.FC<SiteCheckoutSettingsCardProps> = ({
  data,
  disabled,
  errors,
  onChange,
}) => {
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
    <Card>
      <CardTitle title={intl.formatMessage(messages.reservedStock)} />
      <CardContent>
        <Typography variant="body2">
          <FormattedMessage {...messages.reservedStockDescription} />
        </Typography>
        <FormSpacer />
        <TextField
          disabled={disabled}
          error={!!formErrors.reserveStockDurationAuthenticatedUser}
          type="number"
          fullWidth
          name="reserveStockDurationAuthenticatedUser"
          label={intl.formatMessage(
            messages.stockReservationForAuthenticatedUser,
          )}
          helperText={intl.formatMessage(messages.stockWillNotBeReserved)}
          value={
            !!data.reserveStockDurationAuthenticatedUser
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
          disabled={disabled}
          error={!!formErrors.reserveStockDurationAnonymousUser}
          type="number"
          fullWidth
          name="reserveStockDurationAnonymousUser"
          label={intl.formatMessage(messages.stockReservationForAnonymousUser)}
          helperText={intl.formatMessage(messages.stockWillNotBeReserved)}
          value={
            !!data.reserveStockDurationAnonymousUser
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
      </CardContent>
      <CardTitle title={intl.formatMessage(messages.checkoutLimits)} />
      <CardContent>
        <TextField
          disabled={disabled}
          error={!!formErrors.reserveStockDurationAuthenticatedUser}
          type="number"
          fullWidth
          name="limitQuantityPerCheckout"
          label={intl.formatMessage(messages.checkoutLineLimit)}
          helperText={intl.formatMessage(messages.checkoutLimitsDescription)}
          value={
            !!data.limitQuantityPerCheckout
              ? String(data.limitQuantityPerCheckout)
              : ""
          }
          onChange={onChange}
          InputProps={{
            inputProps: {
              autoComplete: "none",
              min: 0,
            },
          }}
        />
      </CardContent>
    </Card>
  );
};
SiteCheckoutSettingsCard.displayName = "SiteCheckoutSettingsCard";
export default SiteCheckoutSettingsCard;
