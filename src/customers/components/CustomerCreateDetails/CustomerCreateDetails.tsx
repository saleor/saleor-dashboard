import CardTitle from "@dashboard/components/CardTitle";
import { AccountErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import { Card, CardContent, TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { CustomerCreatePageFormData } from "../CustomerCreatePage";

const useStyles = makeStyles(
  theme => ({
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridRowGap: theme.spacing(3),
      gridTemplateColumns: "1fr 1fr",
    },
  }),
  { name: "CustomerCreateDetails" },
);

export interface CustomerCreateDetailsProps {
  data: CustomerCreatePageFormData;
  disabled: boolean;
  errors: AccountErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const CustomerCreateDetails: React.FC<CustomerCreateDetailsProps> = props => {
  const { data, disabled, errors, onChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const formErrors = getFormErrors(
    ["customerFirstName", "customerLastName", "email"],
    errors,
  );

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "fjPWOA",
          defaultMessage: "Customer Overview",
          description: "header",
        })}
      />
      <CardContent>
        <div className={classes.root}>
          <TextField
            disabled={disabled}
            error={!!formErrors.customerFirstName}
            fullWidth
            name="customerFirstName"
            label={intl.formatMessage(commonMessages.firstName)}
            helperText={getAccountErrorMessage(
              formErrors.customerFirstName,
              intl,
            )}
            type="text"
            value={data.customerFirstName}
            onChange={onChange}
            inputProps={{
              spellCheck: false,
            }}
          />
          <TextField
            disabled={disabled}
            error={!!formErrors.customerLastName}
            fullWidth
            name="customerLastName"
            label={intl.formatMessage(commonMessages.lastName)}
            helperText={getAccountErrorMessage(
              formErrors.customerLastName,
              intl,
            )}
            type="text"
            value={data.customerLastName}
            onChange={onChange}
            inputProps={{
              spellCheck: false,
            }}
          />
          <TextField
            disabled={disabled}
            error={!!formErrors.email}
            fullWidth
            name="email"
            label={intl.formatMessage(commonMessages.email)}
            helperText={getAccountErrorMessage(formErrors.email, intl)}
            type="email"
            value={data.email}
            onChange={onChange}
            inputProps={{
              spellCheck: false,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

CustomerCreateDetails.displayName = "CustomerCreateDetails";
export default CustomerCreateDetails;
