import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import moment from "moment-timezone";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import Skeleton from "@saleor/components/Skeleton";
import { maybe } from "@saleor/misc";
import { UserError } from "@saleor/types";
import { getFieldError } from "@saleor/utils/errors";
import { CustomerDetails_user } from "../../types/CustomerDetails";

const useStyles = makeStyles(
  theme => ({
    cardTitle: {
      height: 72
    },
    checkbox: {
      marginBottom: theme.spacing()
    },
    content: {
      paddingTop: theme.spacing()
    },
    subtitle: {
      marginTop: theme.spacing()
    }
  }),
  { name: "CustomerDetails" }
);

export interface CustomerDetailsProps {
  customer: CustomerDetails_user;
  data: {
    isActive: boolean;
    note: string;
  };
  disabled: boolean;
  errors: UserError[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = props => {
  const { customer, data, disabled, errors, onChange } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        className={classes.cardTitle}
        title={
          <>
            {maybe<React.ReactNode>(() => customer.email, <Skeleton />)}
            {customer && customer.dateJoined ? (
              <Typography
                className={classes.subtitle}
                variant="caption"
                component="div"
              >
                <FormattedMessage
                  defaultMessage="Active member since {date}"
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
      <CardContent className={classes.content}>
        <ControlledCheckbox
          checked={data.isActive}
          className={classes.checkbox}
          disabled={disabled}
          label={intl.formatMessage({
            defaultMessage: "User account active",
            description: "check to mark this account as active"
          })}
          name="isActive"
          onChange={onChange}
        />
        <TextField
          disabled={disabled}
          error={!!getFieldError(errors, "note")}
          fullWidth
          multiline
          helperText={getFieldError(errors, "note")?.message}
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
};
CustomerDetails.displayName = "CustomerDetails";
export default CustomerDetails;
