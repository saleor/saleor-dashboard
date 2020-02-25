import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import { AddressTypeInput } from "@saleor/customers/types";
import { commonMessages } from "@saleor/intl";
import { UserError } from "@saleor/types";
import { getFieldError } from "@saleor/utils/errors";
import FormSpacer from "../FormSpacer";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType
} from "../SingleAutocompleteSelectField";

const useStyles = makeStyles(
  theme => ({
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridTemplateColumns: "1fr 1fr"
    }
  }),
  { name: "AddressEdit" }
);

interface AddressEditProps {
  countries: SingleAutocompleteChoiceType[];
  countryDisplayValue: string;
  data: AddressTypeInput;
  disabled?: boolean;
  errors: UserError[];
  onChange(event: React.ChangeEvent<any>);
  onCountryChange(event: React.ChangeEvent<any>);
}

const AddressEdit: React.FC<AddressEditProps> = props => {
  const {
    countries,
    countryDisplayValue,
    data,
    disabled,
    errors,
    onChange,
    onCountryChange
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <>
      <div className={classes.root}>
        <div>
          <TextField
            disabled={disabled}
            error={!!getFieldError(errors, "firstName")}
            helperText={getFieldError(errors, "firstName")?.message}
            label={intl.formatMessage(commonMessages.firstName)}
            name="firstName"
            onChange={onChange}
            value={data.firstName}
            fullWidth
          />
        </div>
        <div>
          <TextField
            disabled={disabled}
            error={!!getFieldError(errors, "lastName")}
            helperText={getFieldError(errors, "lastName")?.message}
            label={intl.formatMessage(commonMessages.lastName)}
            name="lastName"
            onChange={onChange}
            value={data.lastName}
            fullWidth
          />
        </div>
      </div>
      <FormSpacer />
      <div className={classes.root}>
        <div>
          <TextField
            disabled={disabled}
            error={!!getFieldError(errors, "companyName")}
            helperText={getFieldError(errors, "companyName")?.message}
            label={intl.formatMessage({
              defaultMessage: "Company"
            })}
            name="companyName"
            onChange={onChange}
            value={data.companyName}
            fullWidth
          />
        </div>
        <div>
          <TextField
            disabled={disabled}
            error={!!getFieldError(errors, "phone")}
            fullWidth
            helperText={getFieldError(errors, "phone")?.message}
            label={intl.formatMessage({
              defaultMessage: "Phone"
            })}
            name="phone"
            value={data.phone}
            onChange={onChange}
          />
        </div>
      </div>
      <FormSpacer />
      <TextField
        disabled={disabled}
        error={!!getFieldError(errors, "streetAddress1")}
        helperText={getFieldError(errors, "streetAddress1")?.message}
        label={intl.formatMessage({
          defaultMessage: "Address line 1"
        })}
        name="streetAddress1"
        onChange={onChange}
        value={data.streetAddress1}
        fullWidth
      />
      <FormSpacer />
      <TextField
        disabled={disabled}
        error={!!getFieldError(errors, "streetAddress2")}
        helperText={getFieldError(errors, "streetAddress2")?.message}
        label={intl.formatMessage({
          defaultMessage: "Address line 2"
        })}
        name="streetAddress2"
        onChange={onChange}
        value={data.streetAddress2}
        fullWidth
      />
      <FormSpacer />
      <div className={classes.root}>
        <div>
          <TextField
            disabled={disabled}
            error={!!getFieldError(errors, "city")}
            helperText={getFieldError(errors, "city")?.message}
            label={intl.formatMessage({
              defaultMessage: "City"
            })}
            name="city"
            onChange={onChange}
            value={data.city}
            fullWidth
          />
        </div>
        <div>
          <TextField
            disabled={disabled}
            error={!!getFieldError(errors, "postalCode")}
            helperText={getFieldError(errors, "postalCode")?.message}
            label={intl.formatMessage({
              defaultMessage: "ZIP / Postal code"
            })}
            name="postalCode"
            onChange={onChange}
            value={data.postalCode}
            fullWidth
          />
        </div>
      </div>

      <FormSpacer />
      <div className={classes.root}>
        <div>
          <SingleAutocompleteSelectField
            disabled={disabled}
            displayValue={countryDisplayValue}
            error={!!getFieldError(errors, "country")}
            helperText={getFieldError(errors, "country")?.message}
            label={intl.formatMessage({
              defaultMessage: "Country"
            })}
            name="country"
            onChange={onCountryChange}
            value={data.country}
            choices={countries}
            InputProps={{
              autoComplete: "off"
            }}
          />
        </div>
        <div>
          <TextField
            disabled={disabled}
            error={!!getFieldError(errors, "countryArea")}
            helperText={getFieldError(errors, "countryArea")?.message}
            label={intl.formatMessage({
              defaultMessage: "Country area"
            })}
            name="countryArea"
            onChange={onChange}
            value={data.countryArea}
            fullWidth
          />
        </div>
      </div>
    </>
  );
};
AddressEdit.displayName = "AddressEdit";
export default AddressEdit;
