import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import { UserError } from "@saleor/types";
import { getFieldError } from "@saleor/utils/errors";

export interface SiteSettingsMailingFormData {
  defaultMailSenderName: string;
  defaultMailSenderAddress: string;
  customerSetPasswordUrl: string;
}
interface SiteSettingsMailingProps {
  data: SiteSettingsMailingFormData;
  errors: UserError[];
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const useStyles = makeStyles(
  theme => ({
    cardHelperText: {
      position: "relative",
      top: -theme.spacing(1)
    },
    cardHelperTextCaption: {
      marginBottom: theme.spacing(2)
    }
  }),
  {
    name: "SiteSettingsMailing"
  }
);

const SiteSettingsMailing: React.FC<SiteSettingsMailingProps> = props => {
  const { data, disabled, errors, onChange } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Mailing Configuration",
          description: "section header"
        })}
      />
      <CardContent>
        <Typography className={classes.cardHelperText}>
          <FormattedMessage
            defaultMessage="Mailing Configuration"
            description="helper text"
            id="siteSettingsMailingHelperText"
          />
        </Typography>
        <Typography className={classes.cardHelperTextCaption} variant="body2">
          <FormattedMessage defaultMessage="Configurate your email address from which all automatic emails will be sent to your customers." />
        </Typography>
        <TextField
          disabled={disabled}
          error={!!getFieldError(errors, "defaultMailSenderAddress")}
          fullWidth
          name="defaultMailSenderAddress"
          label={intl.formatMessage({
            defaultMessage: "Mailing email address"
          })}
          helperText={
            getFieldError(errors, "defaultMailSenderAddress")?.message
          }
          value={data.defaultMailSenderAddress}
          onChange={onChange}
        />
        <FormSpacer />
        <TextField
          disabled={disabled}
          error={!!getFieldError(errors, "defaultMailSenderName")}
          fullWidth
          name="defaultMailSenderName"
          label={intl.formatMessage({
            defaultMessage: "Mailing email sender"
          })}
          helperText={
            getFieldError(errors, "defaultMailSenderName")?.message ||
            intl.formatMessage({
              defaultMessage: 'This will be visible as "from" name',
              description: "email sender"
            })
          }
          value={data.defaultMailSenderName}
          onChange={onChange}
        />
        <FormSpacer />
        <Hr />
        <FormSpacer />
        <TextField
          disabled={disabled}
          error={!!getFieldError(errors, "customerSetPasswordUrl")}
          fullWidth
          name="customerSetPasswordUrl"
          label={intl.formatMessage({
            defaultMessage: "Customer password reset URL"
          })}
          placeholder={intl.formatMessage({
            defaultMessage: "URL address"
          })}
          helperText={
            getFieldError(errors, "customerSetPasswordUrl")?.message ||
            intl.formatMessage({
              defaultMessage:
                "This URL will be used as a main URL for password resets. It will be sent via email."
            })
          }
          value={data.customerSetPasswordUrl}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
SiteSettingsMailing.displayName = "SiteSettingsMailing";
export default SiteSettingsMailing;
