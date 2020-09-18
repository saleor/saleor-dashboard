import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { SetPassword_setPassword_errors } from "@saleor/auth/types/SetPassword";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import getAccountErrorMessage from "@saleor/utils/errors/account";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    errorText: {
      color: theme.palette.error.contrastText
    },
    panel: {
      background: theme.palette.error.main,
      borderRadius: theme.spacing(),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(1.5)
    },
    submit: {
      width: "100%"
    }
  }),
  {
    name: "NewPasswordPage"
  }
);

export interface NewPasswordPageFormData {
  password: string;
  confirmPassword: string;
}
export interface NewPasswordPageProps {
  disabled: boolean;
  errors: SetPassword_setPassword_errors[];
  onSubmit: (data: NewPasswordPageFormData) => void;
}

const initialForm: NewPasswordPageFormData = {
  confirmPassword: "",
  password: ""
};

const NewPasswordPage: React.FC<NewPasswordPageProps> = props => {
  const { disabled, errors, onSubmit } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const error = getAccountErrorMessage(
    errors.find(err => err.field === "password"),
    intl
  );

  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
      {({ change: handleChange, data, submit: handleSubmit }) => {
        const passwordError =
          data.password !== data.confirmPassword && data.password.length > 0;

        return (
          <>
            {!!error && (
              <div className={classes.panel}>
                <Typography variant="caption" className={classes.errorText}>
                  {error}
                </Typography>
              </div>
            )}
            <Typography>
              <FormattedMessage defaultMessage="Please set up a new password." />
            </Typography>
            <FormSpacer />
            <TextField
              autoFocus
              fullWidth
              autoComplete="none"
              disabled={disabled}
              label={intl.formatMessage({
                defaultMessage: "New Password"
              })}
              name="password"
              onChange={handleChange}
              type="password"
              value={data.password}
              inputProps={{
                "data-test": "password"
              }}
            />
            <FormSpacer />
            <TextField
              fullWidth
              error={passwordError}
              autoComplete="none"
              disabled={disabled}
              label={intl.formatMessage({
                defaultMessage: "Confirm Password"
              })}
              name="confirmPassword"
              onChange={handleChange}
              type="password"
              value={data.confirmPassword}
              helperText={
                passwordError &&
                intl.formatMessage({
                  defaultMessage: "Passwords do not match"
                })
              }
              inputProps={{
                "data-test": "confirm-password"
              }}
            />
            <FormSpacer />
            <Button
              className={classes.submit}
              color="primary"
              disabled={(passwordError && data.password.length > 0) || disabled}
              variant="contained"
              onClick={handleSubmit}
              type="submit"
            >
              <FormattedMessage
                defaultMessage="Set new password"
                description="button"
              />
            </Button>
          </>
        );
      }}
    </Form>
  );
};

NewPasswordPage.displayName = "NewPasswordPage";
export default NewPasswordPage;
