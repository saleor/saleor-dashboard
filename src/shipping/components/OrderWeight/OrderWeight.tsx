import {
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import { ShippingErrorFragment } from "@saleor/graphql";
import { ChangeEvent } from "@saleor/hooks/useForm";
import useShop from "@saleor/hooks/useShop";
import { getShippingWeightRateErrorMessage } from "@saleor/shipping/errors";
import { getFormErrors } from "@saleor/utils/errors";
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
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "vWapBZ",
          defaultMessage: "Order Weight",
          description: "card title",
        })}
      />
      <CardContent>
        <ControlledCheckbox
          name="orderValueRestricted"
          label={
            <>
              <FormattedMessage
                id="r2dojI"
                defaultMessage="Restrict order weight"
                description="checkbox label"
              />
              <Typography variant="caption">
                <FormattedMessage
                  id="7v8suW"
                  defaultMessage="This rate will apply to all orders"
                  description="info text"
                />
              </Typography>
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
                disabled={disabled}
                helperText={getShippingWeightRateErrorMessage(
                  formErrors.minimumOrderWeight,
                  intl,
                )}
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
                      <Typography>{shop?.defaultWeightUnit}</Typography>
                    </InputAdornment>
                  ),
                }}
                value={minValue}
                onChange={onChange}
              />
              <TextField
                disabled={disabled}
                helperText={getShippingWeightRateErrorMessage(
                  formErrors.maximumOrderWeight,
                  intl,
                )}
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
                      <Typography>{shop?.defaultWeightUnit}</Typography>
                    </InputAdornment>
                  ),
                }}
                value={maxValue}
                onChange={onChange}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderWeight;
