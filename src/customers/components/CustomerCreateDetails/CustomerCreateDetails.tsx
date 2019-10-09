import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { commonMessages } from "@saleor/intl";
import { FormErrors } from "../../../types";
import { CustomerCreatePageFormData } from "../CustomerCreatePage";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "grid",
      gridColumnGap: theme.spacing.unit * 2 + "px",
      gridRowGap: theme.spacing.unit * 3 + "px",
      gridTemplateColumns: "1fr 1fr"
    }
  });

export interface CustomerCreateDetailsProps extends WithStyles<typeof styles> {
  data: CustomerCreatePageFormData;
  disabled: boolean;
  errors: FormErrors<"customerFirstName" | "customerLastName" | "email">;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const CustomerCreateDetails = withStyles(styles, {
  name: "CustomerCreateDetails"
})(
  ({
    classes,
    data,
    disabled,
    errors,
    onChange
  }: CustomerCreateDetailsProps) => {
    const intl = useIntl();

    return (
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Customer Overview",
            description: "header"
          })}
        />
        <CardContent>
          <div className={classes.root}>
            <TextField
              disabled={disabled}
              error={!!errors.customerFirstName}
              fullWidth
              name="customerFirstName"
              label={intl.formatMessage(commonMessages.firstName)}
              helperText={errors.customerFirstName}
              type="text"
              value={data.customerFirstName}
              onChange={onChange}
            />
            <TextField
              disabled={disabled}
              error={!!errors.customerLastName}
              fullWidth
              name="customerLastName"
              label={intl.formatMessage(commonMessages.lastName)}
              helperText={errors.customerLastName}
              type="text"
              value={data.customerLastName}
              onChange={onChange}
            />
            <TextField
              disabled={disabled}
              error={!!errors.email}
              fullWidth
              name="email"
              label={intl.formatMessage(commonMessages.email)}
              helperText={errors.email}
              type="email"
              value={data.email}
              onChange={onChange}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
);
CustomerCreateDetails.displayName = "CustomerCreateDetails";
export default CustomerCreateDetails;
