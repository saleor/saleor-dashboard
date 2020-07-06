import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import useClipboard from "@saleor/hooks/useClipboard";
import { FormChange } from "@saleor/hooks/useForm";
import { commonMessages } from "@saleor/intl";
import { getFormErrors } from "@saleor/utils/errors";
import getChannelsErrorMessage from "@saleor/utils/errors/channels";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ChannelErrorFragment } from "../types/ChannelErrorFragment";
import { useStyles } from "./styles";

export interface FormData {
  name: string;
  currencyCode: string;
  slug: string;
}

interface ChannelCreatePageProps {
  data: FormData;
  disabled: boolean;
  errors: any;
  onChange: FormChange;
}

export const ChannelForm: React.FC<ChannelCreatePageProps> = ({
  data,
  disabled,
  errors,
  onChange
}) => {
  const intl = useIntl();
  const [copied, copy] = useClipboard();
  const formErrors = getFormErrors<keyof FormData, ChannelErrorFragment>(
    ["name", "slug", "currencyCode"],
    errors
  );
  const classes = useStyles({});

  return (
    <>
      <Card>
        <CardTitle
          title={intl.formatMessage(commonMessages.generalInformations)}
        />
        <CardContent>
          <TextField
            error={!!formErrors.name}
            helperText={getChannelsErrorMessage(formErrors?.name, intl)}
            disabled={disabled}
            fullWidth
            label={intl.formatMessage({
              defaultMessage: "Channel Name",
              description: "channel name"
            })}
            name="name"
            value={data.name}
            onChange={onChange}
          />
          <FormSpacer />
          <TextField
            error={!!formErrors.slug}
            helperText={getChannelsErrorMessage(formErrors?.slug, intl)}
            disabled={disabled}
            fullWidth
            label={intl.formatMessage({
              defaultMessage: "Slug",
              description: "channel slug"
            })}
            name="slug"
            value={data.slug}
            onChange={onChange}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  className={classes.copyBtn}
                  position="end"
                  disableTypography
                  onClick={() => copy(data.slug)}
                >
                  {copied ? (
                    <FormattedMessage
                      defaultMessage="Copied"
                      description="button"
                    />
                  ) : (
                    <FormattedMessage
                      defaultMessage="Copy"
                      description="button"
                    />
                  )}
                </InputAdornment>
              )
            }}
          />
          <FormSpacer />
        </CardContent>
      </Card>
      <CardSpacer />
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Channel Settings",
            description: "channel settings"
          })}
        />
        <CardContent>
          <Typography className={classes.currencyTitle}>
            <FormattedMessage
              defaultMessage="Currency"
              description="currency title"
            />
          </Typography>
          <TextField
            error={!!formErrors.currencyCode}
            helperText={getChannelsErrorMessage(formErrors?.currencyCode, intl)}
            disabled={disabled}
            fullWidth
            label={intl.formatMessage({
              defaultMessage: "Select Currency",
              description: "channel currency"
            })}
            name="currencyCode"
            value={data.currencyCode}
            onChange={onChange}
          />
        </CardContent>
      </Card>
    </>
  );
};

ChannelForm.displayName = "ChannelForm";
export default ChannelForm;
