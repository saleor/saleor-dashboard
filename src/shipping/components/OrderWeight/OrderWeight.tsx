// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import VerticalSpacer from "@dashboard/components/VerticalSpacer";
import { ShippingErrorFragment } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import useShop from "@dashboard/hooks/useShop";
import { getShippingWeightRateErrorMessage } from "@dashboard/shipping/errors";
import { getFormErrors } from "@dashboard/utils/errors";
import { InputAdornment, TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

export interface OrderWeightProps {
  disabled: boolean;
  errors: ShippingErrorFragment[];
  orderValueRestricted: boolean;
  maxValue: string;
  minValue: string;
  onChange: (event: ChangeEvent) => void;
}

export const OrderWeight: React.FC<OrderWeightProps> = ({
  orderValueRestricted,
  disabled,
  errors,
  maxValue = "",
  minValue = "",
  onChange,
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const shop = useShop();
  const formFields = ["minimumOrderWeight", "maximumOrderWeight"];
  const formErrors = getFormErrors(formFields, errors);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "vWapBZ",
            defaultMessage: "Order Weight",
            description: "card title",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <ControlledCheckbox
          data-test-id="order-weight-checkbox"
          name="orderValueRestricted"
          label={
            <>
              <FormattedMessage
                id="r2dojI"
                defaultMessage="Restrict order weight"
                description="checkbox label"
              />
              <Text size={2} fontWeight="light" display="block">
                <FormattedMessage
                  id="7v8suW"
                  defaultMessage="This rate will apply to all orders"
                  description="info text"
                />
              </Text>
            </>
          }
          checked={orderValueRestricted}
          onChange={onChange}
          disabled={disabled}
        />
        {orderValueRestricted && (
          <>
            <VerticalSpacer spacing={2} />
            <div className={classes.grid}>
              <TextField
                data-test-id="min-order-weight-input"
                disabled={disabled}
                helperText={getShippingWeightRateErrorMessage(formErrors.minimumOrderWeight, intl)}
                error={!!formErrors.minimumOrderWeight}
                fullWidth
                label={intl.formatMessage({
                  id: "w+5Djm",
                  defaultMessage: "Min. Order Weight",
                })}
                name="minValue"
                type="number"
                inputProps={{
                  min: 0,
                  type: "number",
                }}
                InputProps={{
                  inputProps: { min: 0 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Text>{shop?.defaultWeightUnit}</Text>
                    </InputAdornment>
                  ),
                }}
                value={minValue}
                onChange={onChange}
              />
              <TextField
                data-test-id="max-order-weight-input"
                disabled={disabled}
                helperText={getShippingWeightRateErrorMessage(formErrors.maximumOrderWeight, intl)}
                error={!!formErrors.maximumOrderWeight}
                fullWidth
                label={intl.formatMessage({
                  id: "u0V06N",
                  defaultMessage: "Max. Order Weight",
                })}
                name="maxValue"
                type="number"
                InputProps={{
                  inputProps: { min: minValue },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Text>{shop?.defaultWeightUnit}</Text>
                    </InputAdornment>
                  ),
                }}
                value={maxValue}
                onChange={onChange}
              />
            </div>
          </>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default OrderWeight;
