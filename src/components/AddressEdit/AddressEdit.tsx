import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import { AddressTypeInput } from "@saleor/customers/types";
import { commonMessages } from "@saleor/intl";
import { FormErrors } from "@saleor/types";
import FormSpacer from "../FormSpacer";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType
} from "../SingleAutocompleteSelectField";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "grid",
      gridColumnGap: `${theme.spacing.unit * 2}px`,
      gridTemplateColumns: "1fr 1fr"
    }
  });

interface AddressEditProps extends WithStyles<typeof styles> {
  countries: SingleAutocompleteChoiceType[];
  countryDisplayValue: string;
  data: AddressTypeInput;
  disabled?: boolean;
  errors: FormErrors<keyof AddressTypeInput>;
  onChange(event: React.ChangeEvent<any>);
  onCountryChange(event: React.ChangeEvent<any>);
}

const AddressEdit = withStyles(styles, { name: "AddressEdit" })(
  ({
    classes,
    countries,
    countryDisplayValue,
    data,
    disabled,
    errors,
    onChange,
    onCountryChange
  }: AddressEditProps) => {
    const intl = useIntl();

    return (
      <>
        <div className={classes.root}>
          <div>
            <TextField
              disabled={disabled}
              error={!!errors.firstName}
              helperText={errors.firstName}
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
              error={!!errors.lastName}
              helperText={errors.lastName}
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
              error={!!errors.companyName}
              helperText={errors.companyName}
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
              error={!!errors.phone}
              fullWidth
              helperText={errors.phone}
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
          error={!!errors.streetAddress1}
          helperText={errors.streetAddress1}
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
          error={!!errors.streetAddress2}
          helperText={errors.streetAddress2}
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
              error={!!errors.city}
              helperText={errors.city}
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
              error={!!errors.postalCode}
              helperText={errors.postalCode}
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
              error={!!errors.country}
              helperText={errors.country}
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
              error={!!errors.countryArea}
              helperText={errors.countryArea}
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
  }
);
AddressEdit.displayName = "AddressEdit";
export default AddressEdit;
