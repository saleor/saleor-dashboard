import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import FormSpacer from "@saleor/components/FormSpacer";
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
            <>
              <FormattedMessage
                id="05hqq6"
                defaultMessage="Automatically approve all fulfillments"
                description="checkbox label"
              />
              <Typography variant="caption">
                <FormattedMessage
                  id="XwQQ1f"
                  defaultMessage="All fulfillments will be automatically approved"
                  description="checkbox label description"
                />
              </Typography>
            </>
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
            <>
              <FormattedMessage
                id="2MKkgX"
                defaultMessage="Allow fulfillment without payment"
                description="checkbox label"
              />
              <Typography variant="caption">
                <FormattedMessage
                  id="l9ETHu"
                  defaultMessage="You will be able to fulfill products without capturing payment for the order."
                  description="checkbox label description"
                />
              </Typography>
            </>
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
