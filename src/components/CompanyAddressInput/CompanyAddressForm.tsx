import { TextField } from "@material-ui/core";
import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType,
} from "@saleor/components/SingleAutocompleteSelectField";
import { AddressTypeInput } from "@saleor/customers/types";
import {
  AccountErrorFragment,
  ShopErrorFragment,
  WarehouseErrorFragment,
} from "@saleor/graphql";
import { ChangeEvent } from "@saleor/hooks/useForm";
import { makeStyles } from "@saleor/macaw-ui";
import { getFormErrors } from "@saleor/utils/errors";
import getAccountErrorMessage from "@saleor/utils/errors/account";
import getShopErrorMessage from "@saleor/utils/errors/shop";
import getWarehouseErrorMessage from "@saleor/utils/errors/warehouse";
import React from "react";
import { IntlShape, useIntl } from "react-intl";

export interface CompanyAddressFormProps {
  countries: SingleAutocompleteChoiceType[];
  data: AddressTypeInput;
  displayCountry: string;
  errors: Array<
    AccountErrorFragment | ShopErrorFragment | WarehouseErrorFragment
  >;
  disabled: boolean;
  onChange: (event: ChangeEvent) => void;
  onCountryChange: (event: ChangeEvent) => void;
}

const useStyles = makeStyles(
  {
    root: {},
  },
  { name: "CompanyAddressForm" },
);

function getErrorMessage(
  err: AccountErrorFragment | ShopErrorFragment | WarehouseErrorFragment,
  intl: IntlShape,
): string {
  switch (err?.__typename) {
    case "AccountError":
      return getAccountErrorMessage(err, intl);
    case "WarehouseError":
      return getWarehouseErrorMessage(err, intl);
    default:
      return getShopErrorMessage(err, intl);
  }
}

const CompanyAddressForm: React.FC<CompanyAddressFormProps> = props => {
  const {
    countries,
    data,
    disabled,
    displayCountry,
    errors,
    onChange,
    onCountryChange,
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const formFields = [
    "companyName",
    "streetAddress1",
    "streetAddress2",
    "city",
    "postalCode",
    "country",
    "countryArea",
    "companyArea",
    "phone",
  ];
  const formErrors = getFormErrors(formFields, errors);

  return (
    <div className={classes.root}>
      <TextField
        disabled={disabled}
        error={!!formErrors.companyName}
        helperText={getErrorMessage(formErrors.companyName, intl)}
        label={intl.formatMessage({
          id: "9YazHG",
          defaultMessage: "Company",
        })}
        name={"companyName" as keyof AddressTypeInput}
        onChange={onChange}
        value={data.companyName}
        fullWidth
        InputProps={{
          autoComplete: "organization",
        }}
      />
      <FormSpacer />
      <TextField
        disabled={disabled}
        error={!!formErrors.streetAddress1}
        helperText={getErrorMessage(formErrors.streetAddress1, intl)}
        label={intl.formatMessage({
          id: "B52Em/",
          defaultMessage: "Address line 1",
        })}
        name={"streetAddress1" as keyof AddressTypeInput}
        onChange={onChange}
        value={data.streetAddress1}
        fullWidth
        InputProps={{
          autoComplete: "address-line1",
        }}
      />
      <FormSpacer />
      <TextField
        disabled={disabled}
        error={!!formErrors.streetAddress2}
        helperText={getErrorMessage(formErrors.streetAddress2, intl)}
        label={intl.formatMessage({
          id: "oQY0a2",
          defaultMessage: "Address line 2",
        })}
        name={"streetAddress2" as keyof AddressTypeInput}
        onChange={onChange}
        value={data.streetAddress2}
        fullWidth
        InputProps={{
          autoComplete: "address-line2",
        }}
      />
      <FormSpacer />
      <Grid>
        <TextField
          disabled={disabled}
          error={!!formErrors.city}
          helperText={getErrorMessage(formErrors.city, intl)}
          label={intl.formatMessage({
            id: "TE4fIS",
            defaultMessage: "City",
          })}
          name={"city" as keyof AddressTypeInput}
          onChange={onChange}
          value={data.city}
          fullWidth
          InputProps={{
            autoComplete: "address-level2",
          }}
        />
        <TextField
          disabled={disabled}
          error={!!formErrors.postalCode}
          helperText={getErrorMessage(formErrors.postalCode, intl)}
          label={intl.formatMessage({
            id: "oYGfnY",
            defaultMessage: "ZIP / Postal code",
          })}
          name={"postalCode" as keyof AddressTypeInput}
          onChange={onChange}
          value={data.postalCode}
          fullWidth
          InputProps={{
            autoComplete: "postal-code",
          }}
        />
      </Grid>
      <FormSpacer />
      <Grid>
        <SingleAutocompleteSelectField
          data-test-id="address-edit-country-select-field"
          disabled={disabled}
          displayValue={displayCountry}
          error={!!formErrors.country}
          helperText={getErrorMessage(formErrors.country, intl)}
          label={intl.formatMessage({
            id: "vONi+O",
            defaultMessage: "Country",
          })}
          name={"country" as keyof AddressTypeInput}
          onChange={onCountryChange}
          value={data.country}
          choices={countries}
        />
        <TextField
          disabled={disabled}
          error={!!formErrors.countryArea}
          helperText={getErrorMessage(formErrors.countryArea, intl)}
          label={intl.formatMessage({
            id: "AuwpCm",
            defaultMessage: "Country area",
          })}
          name={"countryArea" as keyof AddressTypeInput}
          onChange={onChange}
          value={data.countryArea}
          fullWidth
          InputProps={{
            autoComplete: "address-level1",
          }}
        />
      </Grid>
      <FormSpacer />
      <TextField
        disabled={disabled}
        error={!!formErrors.phone}
        fullWidth
        helperText={getErrorMessage(formErrors.phone, intl)}
        label={intl.formatMessage({
          id: "O95R3Z",
          defaultMessage: "Phone",
        })}
        name={"phone" as keyof AddressTypeInput}
        value={data.phone}
        onChange={onChange}
        InputProps={{
          autoComplete: "tel",
        }}
      />
    </div>
  );
};
CompanyAddressForm.displayName = "CompanyAddressForm";
export default CompanyAddressForm;
