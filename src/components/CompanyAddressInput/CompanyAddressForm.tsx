// @ts-strict-ignore
import FormSpacer from "@dashboard/components/FormSpacer";
import Grid from "@dashboard/components/Grid";
import { AddressTypeInput } from "@dashboard/customers/types";
import {
  AccountErrorFragment,
  ShopErrorFragment,
  WarehouseErrorFragment,
} from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { getFormErrors } from "@dashboard/utils/errors";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import getShopErrorMessage from "@dashboard/utils/errors/shop";
import getWarehouseErrorMessage from "@dashboard/utils/errors/warehouse";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Option } from "@saleor/macaw-ui-next";
import { IntlShape, useIntl } from "react-intl";

import { useAddressValidation } from "../AddressEdit/useAddressValidation";
import { Combobox } from "../Combobox";

export interface CompanyAddressFormProps {
  countries: Option[];
  data: AddressTypeInput;
  displayCountry: string;
  errors: Array<AccountErrorFragment | ShopErrorFragment | WarehouseErrorFragment>;
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

const CompanyAddressForm = (props: CompanyAddressFormProps) => {
  const { countries, data, disabled, displayCountry, errors, onChange, onCountryChange } = props;
  const { areas, isFieldAllowed, getDisplayValue } = useAddressValidation(data.country);
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
    <div className={classes.root} data-test-id="company-info">
      <TextField
        disabled={disabled}
        data-test-id="company-name-input"
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
          spellCheck: false,
        }}
      />
      <FormSpacer />
      <TextField
        disabled={disabled}
        error={!!formErrors.streetAddress1}
        data-test-id="company-address-line-1-input"
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
          spellCheck: false,
        }}
      />
      <FormSpacer />
      <TextField
        disabled={disabled}
        error={!!formErrors.streetAddress2}
        data-test-id="company-address-line-2-input"
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
          spellCheck: false,
        }}
      />
      <FormSpacer />
      <Grid>
        <TextField
          disabled={disabled}
          error={!!formErrors.city}
          data-test-id="company-city-input"
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
            spellCheck: false,
          }}
        />
        <TextField
          disabled={disabled}
          error={!!formErrors.postalCode}
          data-test-id="company-zip-input"
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
            spellCheck: false,
          }}
        />
      </Grid>
      <FormSpacer />
      <Grid>
        <Combobox
          id="autocomplete-dropdown-country"
          data-test-id="address-edit-country-select-field"
          autoComplete="off"
          spellCheck={false}
          disabled={disabled}
          error={!!formErrors.country}
          helperText={getErrorMessage(formErrors.country, intl)}
          label={intl.formatMessage({
            id: "vONi+O",
            defaultMessage: "Country",
          })}
          options={countries}
          fetchOptions={() => undefined}
          name="country"
          value={{
            label: displayCountry,
            value: data.country,
          }}
          onChange={onCountryChange}
        />

        {isFieldAllowed("countryArea") && (
          <Combobox
            id="autocomplete-dropdown-country-area"
            data-test-id="address-edit-country-area-field"
            autoComplete="off"
            spellCheck={false}
            disabled={disabled}
            error={!!formErrors.countryArea}
            helperText={getErrorMessage(formErrors.countryArea, intl)}
            label={intl.formatMessage({
              id: "AuwpCm",
              defaultMessage: "Country area",
            })}
            options={areas}
            fetchOptions={() => undefined}
            name="countryArea"
            value={{
              label: getDisplayValue(data.countryArea),
              value: data.countryArea,
            }}
            onChange={onChange}
          />
        )}
      </Grid>
      <FormSpacer />
      <TextField
        disabled={disabled}
        error={!!formErrors.phone}
        data-test-id="company-phone-input"
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
          spellCheck: false,
        }}
      />
    </div>
  );
};

CompanyAddressForm.displayName = "CompanyAddressForm";
export default CompanyAddressForm;
