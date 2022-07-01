import { TextField } from "@material-ui/core";
import { AddressTypeInput } from "@saleor/customers/types";
import { AccountErrorFragment, OrderErrorFragment } from "@saleor/graphql";
import { commonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import { getFormErrors } from "@saleor/utils/errors";
import getAccountErrorMessage from "@saleor/utils/errors/account";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import React from "react";
import { IntlShape, useIntl } from "react-intl";

import FormSpacer from "../FormSpacer";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType,
} from "../SingleAutocompleteSelectField";

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
  onChange(event: React.ChangeEvent<any>);
  onCountryChange(event: React.ChangeEvent<any>);
}

function getErrorMessage(
  err: AccountErrorFragment | OrderErrorFragment,
  intl: IntlShape,
): string {
  if (err?.__typename === "AccountError") {
    return getAccountErrorMessage(err, intl);
  }

  return getOrderErrorMessage(err, intl);
}

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

  const formFields: Array<keyof AddressTypeInput> = [
    "city",
    "cityArea",
    "country",
    "countryArea",
    "firstName",
    "lastName",
    "companyName",
    "phone",
    "postalCode",
    "streetAddress1",
    "streetAddress2",
  ];

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
            }}
          />
        </div>
        <div>
          <TextField
            disabled={disabled}
            error={!!formErrors.lastName}
            helperText={getErrorMessage(formErrors.lastName, intl)}
            label={intl.formatMessage(commonMessages.lastName)}
            name="lastName"
            onChange={onChange}
            value={data.lastName}
            fullWidth
            InputProps={{
              autoComplete: "new-password",
            }}
          />
        </div>
      </div>
      <FormSpacer />
      <div className={classes.root}>
        <div>
          <TextField
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
            }}
          />
        </div>
        <div>
          <TextField
            disabled={disabled}
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
            }}
          />
        </div>
      </div>
      <FormSpacer />
      <TextField
        disabled={disabled}
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
        name="streetAddress2"
        onChange={onChange}
        value={data.streetAddress2}
        fullWidth
        InputProps={{
          autoComplete: "new-password",
        }}
      />
      <FormSpacer />
      <div className={classes.root}>
        <div>
          <TextField
            disabled={disabled}
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
            }}
          />
        </div>
        <div>
          <TextField
            disabled={disabled}
            error={!!formErrors.postalCode}
            helperText={getErrorMessage(formErrors.postalCode, intl)}
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
            }}
          />
        </div>
      </div>

      <FormSpacer />
      <div className={classes.root}>
        <div>
          <SingleAutocompleteSelectField
            disabled={disabled}
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
          />
        </div>
        <div>
          <TextField
            disabled={disabled}
            error={!!formErrors.countryArea}
            helperText={getErrorMessage(formErrors.countryArea, intl)}
            label={intl.formatMessage({
              id: "AuwpCm",
              defaultMessage: "Country area",
            })}
            name="countryArea"
            onChange={onChange}
            value={data.countryArea}
            fullWidth
            InputProps={{
              autoComplete: "new-password",
            }}
          />
        </div>
      </div>
    </>
  );
};
AddressEdit.displayName = "AddressEdit";
export default AddressEdit;
