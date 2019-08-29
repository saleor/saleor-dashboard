import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import { commonMessages } from "@saleor/intl";
import { SiteSettingsPageFormData } from "../SiteSettingsPage";

interface SiteSettingsDetailsProps {
  data: SiteSettingsPageFormData;
  errors: Partial<{
    description: string;
    domain: string;
    name: string;
  }>;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const SiteSettingsDetails: React.StatelessComponent<
  SiteSettingsDetailsProps
> = ({ data, disabled, errors, onChange }) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
        <TextField
          disabled={disabled}
          error={!!errors.name}
          fullWidth
          name="name"
          label={intl.formatMessage({
            defaultMessage: "Name of your store"
          })}
          helperText={
            errors.name ||
            intl.formatMessage({
              defaultMessage:
                "Name of your store is shown on tab in web browser"
            })
          }
          value={data.name}
          onChange={onChange}
        />
        <FormSpacer />
        <TextField
          disabled={disabled}
          error={!!errors.domain}
          fullWidth
          name="domain"
          label={intl.formatMessage({
            defaultMessage: "URL of your online store"
          })}
          helperText={errors.domain}
          value={data.domain}
          onChange={onChange}
        />
        <FormSpacer />
        <TextField
          disabled={disabled}
          error={!!errors.domain}
          fullWidth
          name="description"
          label={intl.formatMessage({
            defaultMessage: "Store Description"
          })}
          helperText={
            errors.description ||
            intl.formatMessage({
              defaultMessage:
                "Store description is shown on taskbar after your store name"
            })
          }
          value={data.description}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
SiteSettingsDetails.displayName = "SiteSettingsDetails";
export default SiteSettingsDetails;
