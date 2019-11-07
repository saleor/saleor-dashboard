import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";

const useStyles = makeStyles(
  {
    submit: {
      width: "100%"
    }
  },
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
  onSubmit: (data: NewPasswordPageFormData) => void;
}

const initialForm: NewPasswordPageFormData = {
  confirmPassword: "",
  password: ""
};

const NewPasswordPage: React.FC<NewPasswordPageProps> = props => {
  const { disabled, onSubmit } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
      {({ change: handleChange, data, submit: handleSubmit }) => {
        const passwordError =
          data.password !== data.confirmPassword && data.password.length > 0;

        return (
          <>
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
                "data-tc": "password"
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
                "data-tc": "confirm-password"
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
