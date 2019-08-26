import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import Hr from "@saleor/components/Hr";
import TextFieldWithChoice from "@saleor/components/TextFieldWithChoice";
import { commonMessages } from "@saleor/intl";
import { FormErrors } from "../../../types";
import { SaleType } from "../../../types/globalTypes";
import { FormData } from "../SaleDetailsPage";

export interface SalePricingProps {
  data: FormData;
  defaultCurrency: string;
  disabled: boolean;
  errors: FormErrors<"startDate" | "endDate" | "value">;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "grid",
      gridColumnGap: theme.spacing.unit * 2 + "px",
      gridTemplateColumns: "1fr 1fr"
    },
    subheading: {
      gridColumnEnd: "span 2",
      marginBottom: theme.spacing.unit * 2
    }
  });

const SalePricing = withStyles(styles, {
  name: "SalePricing"
})(
  ({
    classes,
    data,
    defaultCurrency,
    disabled,
    errors,
    onChange
  }: SalePricingProps & WithStyles<typeof styles>) => {
    const intl = useIntl();

    return (
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Pricing",
            description: "sale pricing, header"
          })}
        />
        <CardContent className={classes.root}>
          <TextFieldWithChoice
            disabled={disabled}
            ChoiceProps={{
              label: data.type === SaleType.FIXED ? defaultCurrency : "%",
              name: "type",
              values: [
                {
                  label: defaultCurrency,
                  value: SaleType.FIXED
                },
                {
                  label: "%",
                  value: SaleType.PERCENTAGE
                }
              ]
            }}
            error={!!errors.value}
            helperText={errors.value}
            name={"value" as keyof FormData}
            onChange={onChange}
            label={intl.formatMessage({
              defaultMessage: "Discount Value"
            })}
            value={data.value}
            type="number"
            fullWidth
            inputProps={{
              min: 0
            }}
          />
        </CardContent>
        <Hr />
        <CardContent className={classes.root}>
          <Typography className={classes.subheading} variant="subtitle1">
            <FormattedMessage
              defaultMessage="Time Frame"
              description="time during which sale is active"
            />
          </Typography>
          <TextField
            disabled={disabled}
            error={!!errors.startDate}
            helperText={errors.startDate}
            name={"startDate" as keyof FormData}
            onChange={onChange}
            label={intl.formatMessage(commonMessages.startDate)}
            value={data.startDate}
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
          />
          <TextField
            disabled={disabled}
            error={!!errors.endDate}
            helperText={errors.endDate}
            name={"endDate" as keyof FormData}
            onChange={onChange}
            label={intl.formatMessage(commonMessages.endDate)}
            value={data.endDate}
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
          />
        </CardContent>
      </Card>
    );
  }
);
SalePricing.displayName = "SalePricing";
export default SalePricing;
