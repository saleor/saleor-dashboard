import Button from "@material-ui/core/Button";
import { Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import { commonMessages } from "@saleor/intl";

const useStyles = makeStyles(
  (theme: Theme) => ({
    panel: {
      "& span": {
        color: theme.palette.error.contrastText
      },
      background: theme.palette.error.main,
      borderRadius: theme.spacing.unit,
      marginBottom: theme.spacing.unit * 3,
      padding: theme.spacing.unit * 1.5
    },
    submit: {
      width: "100%"
    }
  }),
  {
    name: "ResetPasswordPage"
  }
);

export interface ResetPasswordPageFormData {
  email: string;
}
export interface ResetPasswordPageProps {
  disabled: boolean;
  error: string;
  onSubmit: (data: ResetPasswordPageFormData) => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = props => {
  const { disabled, error, onSubmit } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Form initial={{ email: "" }} onSubmit={onSubmit}>
      {({ change: handleChange, data, submit: handleSubmit }) => (
        <>
          {!!error && (
            <div className={classes.panel}>
              <Typography variant="caption">{error}</Typography>
            </div>
          )}
          <Typography>
            <FormattedMessage defaultMessage="Forgot your password? Don't worry, we'll reset it for you." />
          </Typography>
          <FormSpacer />
          <TextField
            autoFocus
            disabled={disabled}
            fullWidth
            autoComplete="username"
            label={intl.formatMessage(commonMessages.email)}
            name="email"
            onChange={handleChange}
            value={data.email}
            inputProps={{
              "data-tc": "email"
            }}
          />
          <FormSpacer />
          <Button
            className={classes.submit}
            color="primary"
            disabled={disabled}
            variant="contained"
            onClick={handleSubmit}
            type="submit"
          >
            <FormattedMessage
              defaultMessage="Send Instructions"
              description="password reset, button"
            />
          </Button>
        </>
      )}
    </Form>
  );
};

ResetPasswordPage.displayName = "ResetPasswordPage";
export default ResetPasswordPage;
