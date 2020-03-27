import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType
} from "@saleor/components/SingleAutocompleteSelectField";
import { ChangeEvent } from "@saleor/hooks/useForm";
import { UserError } from "@saleor/types";
import { getFieldError } from "@saleor/utils/errors";
import { SiteSettingsPageFormData } from "../SiteSettingsPage";

interface SiteSettingsAddressProps {
  countries: SingleAutocompleteChoiceType[];
  data: SiteSettingsPageFormData;
  displayCountry: string;
  errors: UserError[];
  disabled: boolean;
  onChange: (event: ChangeEvent) => void;
  onCountryChange: (event: ChangeEvent) => void;
}

const useStyles = makeStyles(
  {
    root: {
      overflow: "visible"
    }
  },
  { name: "SiteSettingsAddress" }
);

const SiteSettingsAddress: React.FC<SiteSettingsAddressProps> = props => {
  const {
    countries,
    data,
    disabled,
    displayCountry,
    errors,
    onChange,
    onCountryChange
  } = props;
  const classes = useStyles(props);

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
          error={!!getFieldError(errors, "companyName")}
          helperText={getFieldError(errors, "companyName")?.message}
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
          error={!!getFieldError(errors, "streetAddress1")}
          helperText={getFieldError(errors, "streetAddress1")?.message}
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
          error={!!getFieldError(errors, "streetAddress2")}
          helperText={getFieldError(errors, "streetAddress2")?.message}
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
            error={!!getFieldError(errors, "city")}
            helperText={getFieldError(errors, "city")?.message}
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
            error={!!getFieldError(errors, "postalCode")}
            helperText={getFieldError(errors, "postalCode")?.message}
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
            error={!!getFieldError(errors, "country")}
            helperText={getFieldError(errors, "country")?.message}
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
            error={!!getFieldError(errors, "companyArea")}
            helperText={getFieldError(errors, "companyArea")?.message}
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
          error={!!getFieldError(errors, "phone")}
          fullWidth
          helperText={getFieldError(errors, "phone")?.message}
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
};
SiteSettingsAddress.displayName = "SiteSettingsAddress";
export default SiteSettingsAddress;
