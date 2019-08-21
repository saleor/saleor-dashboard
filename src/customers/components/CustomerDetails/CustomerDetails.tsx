import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import moment from "moment-timezone";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import { FormSpacer } from "@saleor/components/FormSpacer";
import Skeleton from "@saleor/components/Skeleton";
import { commonMessages } from "@saleor/intl";
import { CustomerDetails_user } from "../../types/CustomerDetails";

const styles = (theme: Theme) =>
  createStyles({
    cardTitle: {
      height: 64
    },
    root: {
      display: "grid" as "grid",
      gridColumnGap: theme.spacing.unit * 2 + "px",
      gridRowGap: theme.spacing.unit * 3 + "px",
      gridTemplateColumns: "1fr 1fr"
    }
  });

export interface CustomerDetailsProps extends WithStyles<typeof styles> {
  customer: CustomerDetails_user;
  data: {
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    note: string;
  };
  disabled: boolean;
  errors: {
    firstName?: string;
    lastName?: string;
    email?: string;
    note?: string;
  };
  onChange: (event: React.ChangeEvent<any>) => void;
}

const CustomerDetails = withStyles(styles, { name: "CustomerDetails" })(
  ({
    classes,
    customer,
    data,
    disabled,
    errors,
    onChange
  }: CustomerDetailsProps) => {
    const intl = useIntl();

    return (
      <Card>
        <CardTitle
          className={classes.cardTitle}
          title={
            <>
              <FormattedMessage {...commonMessages.generalInformations} />
              {customer && customer.dateJoined ? (
                <Typography variant="caption">
                  <FormattedMessage
                    defaultMessage="Customer since: {date}"
                    description="section subheader"
                    values={{
                      date: moment(customer.dateJoined).format("MMM YYYY")
                    }}
                  />
                </Typography>
              ) : (
                <Skeleton style={{ width: "10rem" }} />
              )}
            </>
          }
        />
        <CardContent>
          <ControlledCheckbox
            checked={data.isActive}
            disabled={disabled}
            label={intl.formatMessage({
              defaultMessage: "User account active",
              description: "check to mark this account as active"
            })}
            name="isActive"
            onChange={onChange}
          />
          <FormSpacer />
          <div className={classes.root}>
            <TextField
              disabled={disabled}
              error={!!errors.firstName}
              fullWidth
              helperText={errors.firstName}
              name="firstName"
              type="text"
              label={intl.formatMessage(commonMessages.firstName)}
              value={data.firstName}
              onChange={onChange}
            />
            <TextField
              disabled={disabled}
              error={!!errors.lastName}
              fullWidth
              helperText={errors.lastName}
              name="lastName"
              type="text"
              label={intl.formatMessage(commonMessages.lastName)}
              value={data.lastName}
              onChange={onChange}
            />
          </div>
          <FormSpacer />
          <TextField
            disabled={disabled}
            error={!!errors.email}
            fullWidth
            helperText={errors.email}
            name="email"
            type="email"
            label={intl.formatMessage(commonMessages.email)}
            value={data.email}
            onChange={onChange}
          />
          <FormSpacer />
          <TextField
            disabled={disabled}
            error={!!errors.note}
            fullWidth
            multiline
            helperText={errors.note}
            name="note"
            label={intl.formatMessage({
              defaultMessage: "Note",
              description: "note about customer"
            })}
            value={data.note}
            onChange={onChange}
          />
        </CardContent>
      </Card>
    );
  }
);
CustomerDetails.displayName = "CustomerDetails";
export default CustomerDetails;
