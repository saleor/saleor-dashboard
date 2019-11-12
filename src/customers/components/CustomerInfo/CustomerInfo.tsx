import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import moment from "moment-timezone";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import Skeleton from "@saleor/components/Skeleton";
import { commonMessages } from "@saleor/intl";
import { CustomerDetails_user } from "../../types/CustomerDetails";

const useStyles = makeStyles(theme => ({
  cardTitle: {
    height: 64
  },
  content: {
    paddingTop: theme.spacing(2)
  },
  hr: {
    margin: theme.spacing(3, 0)
  },
  sectionHeader: {
    marginBottom: theme.spacing()
  }
}));

export interface CustomerDetailsProps {
  customer: CustomerDetails_user;
  data: {
    firstName: string;
    lastName: string;
    email: string;
  };
  disabled: boolean;
  errors: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
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
            <FormattedMessage {...commonMessages.generalInformations} />
            {customer && customer.dateJoined ? (
              <Typography variant="caption" component="div">
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
      <CardContent className={classes.content}>
        <Typography className={classes.sectionHeader}>
          <FormattedMessage {...commonMessages.generalInformations} />
        </Typography>
        <Grid variant="uniform">
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
        </Grid>
        <Hr className={classes.hr} />
        <Typography className={classes.sectionHeader}>
          <FormattedMessage
            defaultMessage="Contact Informations"
            description="customer contact section, header"
          />
        </Typography>
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
      </CardContent>
    </Card>
  );
};
CustomerDetails.displayName = "CustomerDetails";
export default CustomerDetails;
