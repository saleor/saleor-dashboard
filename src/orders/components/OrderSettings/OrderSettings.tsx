import { Card, CardContent, Typography } from "@material-ui/core";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderSettingsFormData } from "../OrderSettingsPage/types";

export interface OrderSettingsProps {
  data: OrderSettingsFormData;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const OrderSettings: React.FC<OrderSettingsProps> = ({
  data,
  disabled,
  onChange,
}) => {
  const intl = useIntl();

  return (
    <Card data-test-id="order-settings">
      <CardTitle
        title={intl.formatMessage({
          id: "CLYlsu",
          defaultMessage: "Settings",
          description: "section header",
        })}
      />
      <CardContent>
        <ControlledCheckbox
          name="automaticallyConfirmAllNewOrders"
          label={
            <>
              <FormattedMessage
                id="RLYfMF"
                defaultMessage="Automatically confirm all orders"
                description="checkbox label"
              />
              <Typography variant="caption">
                <FormattedMessage
                  id="wpAXKX"
                  defaultMessage="All orders will be automatically confirmed and all payments will be captured."
                  description="checkbox label description"
                />
              </Typography>
            </>
          }
          checked={data.automaticallyConfirmAllNewOrders}
          onChange={onChange}
          disabled={disabled}
          data-test-id="automatically-confirm-all-new-orders-checkbox"
        />
        <CardSpacer />
        <ControlledCheckbox
          name="automaticallyFulfillNonShippableGiftCard"
          label={
            <>
              <FormattedMessage
                id="7UG1Lx"
                defaultMessage="Automatically fulfill non shippable gift cards"
                description="checkbox gift cards label"
              />
              <Typography variant="caption">
                <FormattedMessage
                  id="Nfh9QM"
                  defaultMessage="when activated non-shippable gift cards will be automatically set as fulfilled and sent to customer"
                  description="checkbox gift cards label description"
                />
              </Typography>
            </>
          }
          checked={data.automaticallyFulfillNonShippableGiftCard}
          onChange={onChange}
          disabled={disabled}
          data-test-id="automatically-fulfill-non-shippable-gift-cards-checkbox"
        />
      </CardContent>
    </Card>
  );
};
OrderSettings.displayName = "OrderSettings";
export default OrderSettings;
