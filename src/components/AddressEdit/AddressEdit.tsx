// @ts-strict-ignore
import { AddressTypeInput } from "@dashboard/customers/types";
import { AccountErrorFragment, OrderErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import FormSpacer from "../FormSpacer";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType,
} from "../SingleAutocompleteSelectField";
import { getErrorMessage } from "./getErrorMessage";
import { useAddressValidation } from "./useAddressValidation";

const useStyles = makeStyles(
  theme => ({
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridTemplateColumns: "1fr 1fr",
    },
  }),
  { name: "AddressEdit" },
);

interface AddressEditProps {
  countries: SingleAutocompleteChoiceType[];
  countryDisplayValue: string;
  data: AddressTypeInput;
  disabled?: boolean;
  errors: Array<AccountErrorFragment | OrderErrorFragment>;
  onChange: (event: React.ChangeEvent<any>) => any;
  onCountryChange: (event: React.ChangeEvent<any>) => any;
}

const PossibleFormFields = {
  CITY: "city",
  CITY_AREA: "cityArea",
  COUNTRY: "country",
  COUNTRY_AREA: "countryArea",
  FIRST_NAME: "firstName",
  LAST_NAME: "lastName",
  COMPANY_NAME: "companyName",
  PHONE: "phone",
  POSTAL_CODE: "postalCode",
  STREET_ADDRESS_1: "streetAddress1",
  STREET_ADDRESS_2: "streetAddress2",
} as const;

const formFields: Array<keyof AddressTypeInput> =
  Object.values(PossibleFormFields);

const AddressEdit: React.FC<AddressEditProps> = props => {
  const {
    countries,
    countryDisplayValue,
    data,
    disabled,
    errors,
    onChange,
    onCountryChange,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const { areas, isFieldAllowed, getDisplayValue } = useAddressValidation(
    data.country,
  );

  const formErrors = getFormErrors<
    keyof AddressTypeInput,
    AccountErrorFragment | OrderErrorFragment
  >(formFields, errors);

  return (
    <>
      <div className={classes.root}>
        <div>
          <TextField
            disabled={disabled}
            data-test-id="first-name-input"
            error={!!formErrors.firstName}
            helperText={getErrorMessage(formErrors.firstName, intl)}
            label={intl.formatMessage(commonMessages.firstName)}
            name="firstName"
            onChange={onChange}
            value={data.firstName}
            fullWidth
            InputProps={{
              // Setting 'autoComplete: "new-password"' is the only way to
              // disable Chrome's autofill on forms as of early 2022
              autoComplete: "new-password",
              spellCheck: false,
            }}
          />
        </div>
        <div>
          <TextField
            disabled={disabled}
            data-test-id="last-name-input"
            error={!!formErrors.lastName}
            helperText={getErrorMessage(formErrors.lastName, intl)}
            label={intl.formatMessage(commonMessages.lastName)}
            name="lastName"
            onChange={onChange}
            value={data.lastName}
            fullWidth
            InputProps={{
              autoComplete: "new-password",
              spellCheck: false,
            }}
          />
        </div>
      </div>
      <FormSpacer />
      <div className={classes.root}>
        <div>
          <TextField
            data-test-id="company-name-input"
            disabled={disabled}
            error={!!formErrors.companyName}
            helperText={getErrorMessage(formErrors.companyName, intl)}
            label={intl.formatMessage({
              id: "9YazHG",
              defaultMessage: "Company",
            })}
            name="companyName"
            onChange={onChange}
            value={data.companyName}
            fullWidth
            InputProps={{
              autoComplete: "new-password",
              spellCheck: false,
            }}
          />
        </div>
        <div>
          <TextField
            disabled={disabled}
            data-test-id="phone-input"
            error={!!formErrors.phone}
            fullWidth
            helperText={getErrorMessage(formErrors.phone, intl)}
            label={intl.formatMessage({
              id: "O95R3Z",
              defaultMessage: "Phone",
            })}
            name="phone"
            value={data.phone}
            onChange={onChange}
            InputProps={{
              autoComplete: "new-password",
              spellCheck: false,
            }}
          />
        </div>
      </div>
      <FormSpacer />
      <TextField
        disabled={disabled}
        data-test-id="address-line-1-input"
        error={!!formErrors.streetAddress1}
        helperText={getErrorMessage(formErrors.streetAddress1, intl)}
        label={intl.formatMessage({
          id: "B52Em/",
          defaultMessage: "Address line 1",
        })}
        name="streetAddress1"
        onChange={onChange}
        value={data.streetAddress1}
        fullWidth
        InputProps={{
          autoComplete: "new-password",
          spellCheck: false,
        }}
      />
      <FormSpacer />
      <TextField
        disabled={disabled}
        data-test-id="address-line-2-input"
        error={!!formErrors.streetAddress2}
        helperText={getErrorMessage(formErrors.streetAddress2, intl)}
        label={intl.formatMessage({
          id: "oQY0a2",
          defaultMessage: "Address line 2",
        })}
        name="streetAddress2"
        onChange={onChange}
        value={data.streetAddress2}
        fullWidth
        InputProps={{
          autoComplete: "new-password",
          spellCheck: false,
        }}
      />
      <FormSpacer />
      <div className={classes.root}>
        <div>
          <TextField
            disabled={disabled}
            data-test-id="city-input"
            error={!!formErrors.city}
            helperText={getErrorMessage(formErrors.city, intl)}
            label={intl.formatMessage({
              id: "TE4fIS",
              defaultMessage: "City",
            })}
            name="city"
            onChange={onChange}
            value={data.city}
            fullWidth
            InputProps={{
              autoComplete: "new-password",
              spellCheck: false,
            }}
          />
        </div>
        <div>
          <TextField
            disabled={disabled}
            data-test-id="zip-input"
            error={!!formErrors.postalCode}
            label={intl.formatMessage({
              id: "oYGfnY",
              defaultMessage: "ZIP / Postal code",
            })}
            name="postalCode"
            onChange={onChange}
            value={data.postalCode}
            fullWidth
            InputProps={{
              autoComplete: "new-password",
              spellCheck: false,
            }}
          />
        </div>
      </div>

      <FormSpacer />
      <div className={classes.root}>
        <div>
          <SingleAutocompleteSelectField
            disabled={disabled}
            autocomplete="new-password"
            data-test-id="address-edit-country-select-field"
            displayValue={countryDisplayValue}
            error={!!formErrors.country}
            helperText={getErrorMessage(formErrors.country, intl)}
            label={intl.formatMessage({
              id: "vONi+O",
              defaultMessage: "Country",
            })}
            name="country"
            onChange={onCountryChange}
            value={data.country}
            choices={countries}
            InputProps={{
              spellCheck: false,
            }}
          />
        </div>
        <div>
          {isFieldAllowed(PossibleFormFields.COUNTRY_AREA) && (
            <SingleAutocompleteSelectField
              disabled={disabled}
              autocomplete="new-password"
              data-test-id="address-edit-country-area-field"
              displayValue={getDisplayValue(data.countryArea)}
              error={!!formErrors.countryArea}
              helperText={getErrorMessage(formErrors.countryArea, intl)}
              label={intl.formatMessage({
                id: "AuwpCm",
                defaultMessage: "Country area",
              })}
              name="countryArea"
              onChange={onChange}
              value={data.countryArea}
              choices={areas}
              InputProps={{
                spellCheck: false,
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};
AddressEdit.displayName = "AddressEdit";
export default AddressEdit;
