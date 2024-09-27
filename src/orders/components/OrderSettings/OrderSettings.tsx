import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderSettingsFormData } from "../OrderSettingsPage/types";

interface OrderSettingsProps {
  data: OrderSettingsFormData;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const OrderSettings: React.FC<OrderSettingsProps> = ({ data, disabled, onChange }) => {
  const intl = useIntl();

  return (
    <DashboardCard data-test-id="order-settings">
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "kn7jjd",
            defaultMessage: "General settings",
            description: "section header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <ControlledCheckbox
          name="automaticallyConfirmAllNewOrders"
          label={
            <Box display="flex" flexDirection="column">
              <Text>
                <FormattedMessage
                  id="RLYfMF"
                  defaultMessage="Automatically confirm all orders"
                  description="checkbox label"
                />
              </Text>
              <Text size={2} color="default2">
                <FormattedMessage
                  id="wpAXKX"
                  defaultMessage="All orders will be automatically confirmed and all payments will be captured."
                  description="checkbox label description"
                />
              </Text>
            </Box>
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
            <Box display="flex" flexDirection="column">
              <Text>
                <FormattedMessage
                  id="7UG1Lx"
                  defaultMessage="Automatically fulfill non shippable gift cards"
                  description="checkbox gift cards label"
                />
              </Text>
              <Text size={2} color="default2">
                <FormattedMessage
                  id="EewziG"
                  defaultMessage="When activated non-shippable gift cards will be automatically set as fulfilled and sent to customer"
                  description="checkbox gift cards label description"
                />
              </Text>
            </Box>
          }
          checked={data.automaticallyFulfillNonShippableGiftCard}
          onChange={onChange}
          disabled={disabled}
          data-test-id="automatically-fulfill-non-shippable-gift-cards-checkbox"
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

OrderSettings.displayName = "OrderSettings";
export default OrderSettings;
