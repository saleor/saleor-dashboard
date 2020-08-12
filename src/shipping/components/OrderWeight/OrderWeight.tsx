import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import { ShippingErrorFragment } from "@saleor/fragments/types/ShippingErrorFragment";
import { ChangeEvent } from "@saleor/hooks/useForm";
import { getShippingWeightRateErrorMessage } from "@saleor/shipping/errors";
import { getFormErrors } from "@saleor/utils/errors";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

export interface OrderWeightProps {
  disabled: boolean;
  errors: ShippingErrorFragment[];
  noLimits: boolean;
  maxValue: string;
  minValue: string;
  onChange: (event: ChangeEvent) => void;
}

export const OrderWeight: React.FC<OrderWeightProps> = ({
  noLimits,
  disabled,
  errors,
  maxValue = "",
  minValue = "",
  onChange
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const formFields = ["minimumOrderWeight", "maximumOrderWeight"];
  const formErrors = getFormErrors(formFields, errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Weight value",
          description: "price rates order value"
        })}
      />
      <CardContent>
        <ControlledCheckbox
          name="noLimits"
          label={
            <FormattedMessage
              defaultMessage="There are no value limits"
              description="shipping method has no value limits"
            />
          }
          checked={noLimits}
          onChange={onChange}
          disabled={disabled}
        />
        <Typography variant="caption" className={classes.info}>
          <FormattedMessage
            defaultMessage="Channels that don’t have assigned discounts will use their parent channel to define the price. Price will be converted to channel’s currency"
            description="channels discount"
          />
        </Typography>
        {!noLimits && (
          <div className={classes.grid}>
            <TextField
              disabled={disabled}
              helperText={getShippingWeightRateErrorMessage(
                formErrors.minimumOrderWeight,
                intl
              )}
              error={!!formErrors.maximumOrderWeight}
              fullWidth
              label={intl.formatMessage({
                defaultMessage: "Min. Order Weight"
              })}
              name="minValue"
              type="number"
              value={minValue}
              onChange={onChange}
            />
            <TextField
              disabled={disabled}
              helperText={getShippingWeightRateErrorMessage(
                formErrors.maximumOrderWeight,
                intl
              )}
              error={!!formErrors.maximumOrderWeight}
              fullWidth
              label={intl.formatMessage({
                defaultMessage: "Max. Order Weight"
              })}
              name="maxValue"
              type="number"
              value={maxValue}
              onChange={onChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderWeight;
