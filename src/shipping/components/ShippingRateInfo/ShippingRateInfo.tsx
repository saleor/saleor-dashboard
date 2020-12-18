import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import { ShippingErrorFragment } from "@saleor/fragments/types/ShippingErrorFragment";
import { commonMessages } from "@saleor/intl";
import { getFormErrors } from "@saleor/utils/errors";
import getShippingErrorMessage from "@saleor/utils/errors/shipping";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    deliveryTimeFields: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridRowGap: theme.spacing(1),
      gridTemplateColumns: "1fr 1fr 1fr",
      [theme.breakpoints.down("md")]: {
        gridTemplateColumns: "1fr 1fr"
      },
      [theme.breakpoints.down("xs")]: {
        gridTemplateColumns: "1fr"
      }
    }
  }),
  { name: "ShippingRateInfo" }
);

export interface ShippingRateInfoProps {
  data: Record<"name" | "maxDays" | "minDays", string>;
  disabled: boolean;
  errors: ShippingErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const ShippingRateInfo: React.FC<ShippingRateInfoProps> = props => {
  const { data, disabled, errors, onChange } = props;

  const intl = useIntl();
  const classes = useStyles(props);

  const formErrors = getFormErrors(["name", "minDays", "maxDays"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
        <TextField
          disabled={disabled}
          error={!!formErrors.name}
          fullWidth
          helperText={getShippingErrorMessage(formErrors.name, intl)}
          label={intl.formatMessage({
            defaultMessage: "Shipping rate name"
          })}
          name="name"
          value={data.name}
          onChange={onChange}
        />
        <CardSpacer />
        <div className={classes.deliveryTimeFields}>
          <TextField
            disabled={disabled}
            error={!!formErrors.minDays}
            fullWidth
            helperText={getShippingErrorMessage(formErrors.minDays, intl)}
            label={intl.formatMessage({
              defaultMessage: "Min Delivery Time"
            })}
            type="number"
            inputProps={{
              min: 0,
              type: "number"
            }}
            InputProps={{ inputProps: { min: 0 } }}
            name="minDays"
            value={data.minDays}
            onChange={onChange}
          />
          <TextField
            disabled={disabled}
            error={!!formErrors.maxDays}
            fullWidth
            helperText={getShippingErrorMessage(formErrors.maxDays, intl)}
            label={intl.formatMessage({
              defaultMessage: "Max Delivery Time"
            })}
            type="number"
            inputProps={{
              min: 0,
              type: "number"
            }}
            InputProps={{ inputProps: { min: 0 } }}
            name="maxDays"
            value={data.maxDays}
            onChange={onChange}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};
ShippingRateInfo.displayName = "ShippingRateInfo";
export default ShippingRateInfo;
