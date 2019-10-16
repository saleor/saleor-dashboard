import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType
} from "@saleor/components/SingleAutocompleteSelectField";
import { AddressTypeInput } from "@saleor/customers/types";
import { ChangeEvent } from "@saleor/hooks/useForm";
import { FormErrors } from "@saleor/types";
import { SiteSettingsPageFormData } from "../SiteSettingsPage";

interface SiteSettingsAddressProps extends WithStyles<typeof styles> {
  countries: SingleAutocompleteChoiceType[];
  data: SiteSettingsPageFormData;
  displayCountry: string;
  errors: FormErrors<keyof AddressTypeInput>;
  disabled: boolean;
  onChange: (event: ChangeEvent) => void;
  onCountryChange: (event: ChangeEvent) => void;
}

const styles = createStyles({
  root: {
    overflow: "visible"
  }
});

const SiteSettingsAddress = withStyles(styles, { name: "SiteSettingsAddress" })(
  ({
    classes,
    countries,
    data,
    disabled,
    displayCountry,
    errors,
    onChange,
    onCountryChange
  }: SiteSettingsAddressProps) => {
    const intl = useIntl();

    return (
      <Card className={classes.root}>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Store Information",
            description: "section header"
          })}
        />
        <CardContent>
          <TextField
            disabled={disabled}
            error={!!errors.companyName}
            helperText={errors.companyName}
            label={intl.formatMessage({
              defaultMessage: "Company"
            })}
            name={"companyName" as keyof SiteSettingsPageFormData}
            onChange={onChange}
            value={data.companyName}
            fullWidth
          />
          <FormSpacer />
          <TextField
            disabled={disabled}
            error={!!errors.streetAddress1}
            helperText={errors.streetAddress1}
            label={intl.formatMessage({
              defaultMessage: "Address line 1"
            })}
            name={"streetAddress1" as keyof SiteSettingsPageFormData}
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
            name={"streetAddress2" as keyof SiteSettingsPageFormData}
            onChange={onChange}
            value={data.streetAddress2}
            fullWidth
          />
          <FormSpacer />
          <Grid>
            <TextField
              disabled={disabled}
              error={!!errors.city}
              helperText={errors.city}
              label={intl.formatMessage({
                defaultMessage: "City"
              })}
              name={"city" as keyof SiteSettingsPageFormData}
              onChange={onChange}
              value={data.city}
              fullWidth
            />
            <TextField
              disabled={disabled}
              error={!!errors.postalCode}
              helperText={errors.postalCode}
              label={intl.formatMessage({
                defaultMessage: "ZIP / Postal code"
              })}
              name={"postalCode" as keyof SiteSettingsPageFormData}
              onChange={onChange}
              value={data.postalCode}
              fullWidth
            />
          </Grid>
          <FormSpacer />
          <Grid>
            <SingleAutocompleteSelectField
              disabled={disabled}
              displayValue={displayCountry}
              error={!!errors.country}
              helperText={errors.country}
              label={intl.formatMessage({
                defaultMessage: "Country"
              })}
              name={"country" as keyof SiteSettingsPageFormData}
              onChange={onCountryChange}
              value={data.country}
              choices={countries}
              InputProps={{
                autoComplete: "off"
              }}
            />
            <TextField
              disabled={disabled}
              error={!!errors.countryArea}
              helperText={errors.countryArea}
              label={intl.formatMessage({
                defaultMessage: "Country area"
              })}
              name={"countryArea" as keyof SiteSettingsPageFormData}
              onChange={onChange}
              value={data.countryArea}
              fullWidth
            />
          </Grid>
          <FormSpacer />
          <TextField
            disabled={disabled}
            error={!!errors.phone}
            fullWidth
            helperText={errors.phone}
            label={intl.formatMessage({
              defaultMessage: "Phone"
            })}
            name={"phone" as keyof SiteSettingsPageFormData}
            value={data.phone}
            onChange={onChange}
          />
        </CardContent>
      </Card>
    );
  }
);
SiteSettingsAddress.displayName = "SiteSettingsAddress";
export default SiteSettingsAddress;
