import Button from "@material-ui/core/Button";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import Form from "@saleor/components/Form";
import { FormSpacer } from "@saleor/components/FormSpacer";
import { commonMessages } from "@saleor/intl";

export interface FormData {
  email: string;
  loading: boolean;
  password: string;
  rememberMe: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between"
    },
    link: {
      color: theme.palette.primary.main,
      cursor: "pointer",
      textAlign: "center"
    },
    loginButton: {
      width: 140
    },
    panel: {
      "& span": {
        color: theme.palette.error.contrastText
      },
      background: theme.palette.error.main,
      borderRadius: theme.spacing.unit,
      marginBottom: theme.spacing.unit * 3,
      padding: theme.spacing.unit * 1.5
    }
  });

export interface LoginCardProps extends WithStyles<typeof styles> {
  error: boolean;
  disableLoginButton: boolean;
  onPasswordRecovery: () => void;
  onSubmit?(event: FormData);
}

const LoginCard = withStyles(styles, { name: "LoginCard" })(
  ({
    classes,
    error,
    disableLoginButton,
    onPasswordRecovery,
    onSubmit
  }: LoginCardProps) => {
    const intl = useIntl();

    return (
      <Form
        initial={{ email: "", password: "", rememberMe: false }}
        onSubmit={onSubmit}
      >
        {({ change: handleChange, data, submit: handleSubmit }) => (
          <>
            {error && (
              <div className={classes.panel}>
                <Typography variant="caption">
                  <FormattedMessage defaultMessage="Sorry, your username and/or password are incorrect. Please try again." />
                </Typography>
              </div>
            )}
            <TextField
              autoFocus
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
            <TextField
              fullWidth
              autoComplete="current-password"
              label={intl.formatMessage({
                defaultMessage: "Password"
              })}
              name="password"
              onChange={handleChange}
              type="password"
              value={data.password}
              data-tc="password"
            />
            <FormSpacer />
            <div className={classes.buttonContainer}>
              <ControlledCheckbox
                checked={data.rememberMe}
                label={intl.formatMessage({
                  defaultMessage: "Remember me",
                  description: "login"
                })}
                name="rememberMe"
                onChange={handleChange}
              />
              <FormSpacer />
              <Button
                className={classes.loginButton}
                color="primary"
                disabled={disableLoginButton}
                variant="contained"
                onClick={handleSubmit}
                type="submit"
                data-tc="submit"
              >
                <FormattedMessage defaultMessage="Login" description="button" />
              </Button>
            </div>
            <FormSpacer />
            <Typography className={classes.link} onClick={onPasswordRecovery}>
              <FormattedMessage
                defaultMessage="Reset your password"
                description="button"
              />
            </Typography>
          </>
        )}
      </Form>
    );
  }
);
LoginCard.displayName = "LoginCard";
export default LoginCard;
