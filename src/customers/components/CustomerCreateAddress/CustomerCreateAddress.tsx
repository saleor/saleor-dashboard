import { Card, CardContent, Typography } from "@material-ui/core";
import AddressEdit from "@saleor/components/AddressEdit";
import CardTitle from "@saleor/components/CardTitle";
import { FormSpacer } from "@saleor/components/FormSpacer";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { AccountErrorFragment } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AddressTypeInput } from "../../types";

const useStyles = makeStyles(
  {
    overflow: {
      overflow: "visible",
    },
  },
  { name: "CustomerCreateAddress" },
);

export interface CustomerCreateAddressProps {
  countries: SingleAutocompleteChoiceType[];
  countryDisplayName: string;
  data: AddressTypeInput;
  disabled: boolean;
  errors: AccountErrorFragment[];
  onChange(event: React.ChangeEvent<any>);
  onCountryChange(event: React.ChangeEvent<any>);
}

const CustomerCreateAddress: React.FC<CustomerCreateAddressProps> = props => {
  const {
    countries,
    countryDisplayName,
    data,
    disabled,
    errors,
    onChange,
    onCountryChange,
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card className={classes.overflow}>
      <CardTitle
        title={intl.formatMessage({
          id: "jGGnSZ",
          defaultMessage: "Primary Address",
          description: "page header",
        })}
      />
      <CardContent className={classes.overflow}>
        <Typography>
          <FormattedMessage
            id="wNQzS/"
            defaultMessage="The primary address of this customer."
          />
        </Typography>
        <FormSpacer />
        <AddressEdit
          countries={countries}
          data={data}
          disabled={disabled}
          countryDisplayValue={countryDisplayName}
          errors={errors}
          onChange={onChange}
          onCountryChange={onCountryChange}
        />
      </CardContent>
    </Card>
  );
};
CustomerCreateAddress.displayName = "CustomerCreateAddress";
export default CustomerCreateAddress;
