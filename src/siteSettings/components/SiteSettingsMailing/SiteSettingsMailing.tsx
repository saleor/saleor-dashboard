import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import { FormErrors } from "@saleor/types";

export interface SiteSettingsMailingFormData {
  defaultMailSenderName: string;
  defaultMailSenderAddress: string;
  customerSetPasswordUrl: string;
}
interface SiteSettingsMailingProps {
  data: SiteSettingsMailingFormData;
  errors: FormErrors<
    | "defaultMailSenderAddress"
    | "defaultMailSenderName"
    | "customerSetPasswordUrl"
  >;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    cardHelperText: {
      position: "relative",
      top: -theme.spacing.unit
    },
    cardHelperTextCaption: {
      marginBottom: theme.spacing.unit * 2
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
        <Typography className={classes.cardHelperTextCaption} variant="body1">
          <FormattedMessage defaultMessage="Configurate your email address from which all automatic emails will be sent to your customers." />
        </Typography>
        <TextField
          disabled={disabled}
          error={!!errors.defaultMailSenderAddress}
          fullWidth
          name="defaultMailSenderAddress"
          label={intl.formatMessage({
            defaultMessage: "Mailing email address"
          })}
          helperText={errors.defaultMailSenderAddress}
          value={data.defaultMailSenderAddress}
          onChange={onChange}
        />
        <FormSpacer />
        <TextField
          disabled={disabled}
          error={!!errors.defaultMailSenderName}
          fullWidth
          name="defaultMailSenderName"
          label={intl.formatMessage({
            defaultMessage: "Mailing email sender"
          })}
          helperText={
            errors.defaultMailSenderName ||
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
          error={!!errors.customerSetPasswordUrl}
          fullWidth
          name="customerSetPasswordUrl"
          label={intl.formatMessage({
            defaultMessage: "Customer password reset URL"
          })}
          placeholder={intl.formatMessage({
            defaultMessage: "URL address"
          })}
          helperText={
            errors.customerSetPasswordUrl ||
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
