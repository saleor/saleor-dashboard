import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderSettingsForm } from "../OrgerSettingsPage";

export interface OrderSettingsProps {
  data: OrderSettingsForm;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const OrderSettings: React.FC<OrderSettingsProps> = ({
  data,
  disabled,
  onChange
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Settings",
          description: "section header"
        })}
      />
      <CardContent>
        <ControlledCheckbox
          name={"autoConfirmOrders" as keyof OrderSettingsForm}
          label={
            <>
              <FormattedMessage
                defaultMessage="Automatically confirm all orders"
                description="checkbox label"
              />
              <Typography variant="caption">
                <FormattedMessage
                  defaultMessage="All orders will be automatically confirmed and all payments will be captured."
                  description="checkbox label description"
                />
              </Typography>
            </>
          }
          checked={data.autoConfirmOrders}
          onChange={onChange}
          disabled={disabled}
        />
      </CardContent>
    </Card>
  );
};
OrderSettings.displayName = "OrderSettings";
export default OrderSettings;
