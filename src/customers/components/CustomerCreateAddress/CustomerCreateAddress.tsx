// @ts-strict-ignore
import AddressEdit from "@dashboard/components/AddressEdit";
import { DashboardCard } from "@dashboard/components/Card";
import { FormSpacer } from "@dashboard/components/FormSpacer";
import { SingleAutocompleteChoiceType } from "@dashboard/components/SingleAutocompleteSelectField";
import { AccountErrorFragment } from "@dashboard/graphql";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui-next";
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
  onChange: (event: React.ChangeEvent<any>) => any;
  onCountryChange: (event: React.ChangeEvent<any>) => any;
}

const CustomerCreateAddress: React.FC<CustomerCreateAddressProps> = props => {
  const { countries, countryDisplayName, data, disabled, errors, onChange, onCountryChange } =
    props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <DashboardCard className={classes.overflow}>
      <DashboardCard.Title
        title={intl.formatMessage({
          id: "jGGnSZ",
          defaultMessage: "Primary Address",
          description: "page header",
        })}
      />
      <DashboardCard.Content className={classes.overflow}>
        <Typography>
          <FormattedMessage id="wNQzS/" defaultMessage="The primary address of this customer." />
        </Typography>
        <FormSpacer />
        <Box display="grid" gap={5}>
          <AddressEdit
            countries={countries}
            data={data}
            disabled={disabled}
            countryDisplayValue={countryDisplayName}
            errors={errors}
            onChange={onChange}
            onCountryChange={onCountryChange}
          />
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

CustomerCreateAddress.displayName = "CustomerCreateAddress";
export default CustomerCreateAddress;
