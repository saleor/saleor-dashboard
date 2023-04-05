import CardTitle from "@dashboard/components/CardTitle";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import FormSpacer from "@dashboard/components/FormSpacer";
import { Card, CardContent } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderSettingsFormData } from "../OrderSettingsPage/form";

export interface OrderFulfillmentSettingsProps {
  data: OrderSettingsFormData;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const OrderFulfillmentSettings: React.FC<OrderFulfillmentSettingsProps> = ({
  data,
  disabled,
  onChange,
}) => {
  const intl = useIntl();

  return (
    <Card data-test-id="order-fulfillment-settings">
      <CardTitle
        title={intl.formatMessage({
          id: "G3ay2p",
          defaultMessage: "Fulfillment settings",
          description: "section header",
        })}
      />
      <CardContent>
        <ControlledCheckbox
          name={"fulfillmentAutoApprove" as keyof OrderSettingsFormData}
          label={
            <Box display="flex" flexDirection="column">
              <Text>
                <FormattedMessage
                  id="05hqq6"
                  defaultMessage="Automatically approve all fulfillments"
                  description="checkbox label"
                />
              </Text>
              <Text variant="caption" color="textNeutralSubdued">
                <FormattedMessage
                  id="XwQQ1f"
                  defaultMessage="All fulfillments will be automatically approved"
                  description="checkbox label description"
                />
              </Text>
            </Box>
          }
          checked={data.fulfillmentAutoApprove}
          onChange={onChange}
          disabled={disabled}
          data-test-id="fulfillment-auto-approve-checkbox"
        />
        <FormSpacer />
        <ControlledCheckbox
          name={"fulfillmentAllowUnpaid" as keyof OrderSettingsFormData}
          label={
            <Box display="flex" flexDirection="column">
              <Text>
                <FormattedMessage
                  id="2MKkgX"
                  defaultMessage="Allow fulfillment without payment"
                  description="checkbox label"
                />
              </Text>
              <Text variant="caption" color="textNeutralSubdued">
                <FormattedMessage
                  id="l9ETHu"
                  defaultMessage="You will be able to fulfill products without capturing payment for the order."
                  description="checkbox label description"
                />
              </Text>
            </Box>
          }
          checked={data.fulfillmentAllowUnpaid}
          onChange={onChange}
          disabled={disabled}
          data-test-id="fulfillment-allow-unpaid-checkbox"
        />
      </CardContent>
    </Card>
  );
};
OrderFulfillmentSettings.displayName = "OrderFulfillmentSettings";
export default OrderFulfillmentSettings;
