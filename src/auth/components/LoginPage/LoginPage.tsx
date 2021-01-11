import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Form from "@saleor/components/Form";
import { FormSpacer } from "@saleor/components/FormSpacer";
import { DEMO_MODE } from "@saleor/config";
import { commonMessages } from "@saleor/intl";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface FormData {
  email: string;
  password: string;
}

const useStyles = makeStyles(
  theme => ({
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end"
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
      borderRadius: theme.spacing(),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(1.5)
    }
  }),
  { name: "LoginCard" }
);

export interface LoginCardProps {
  error: boolean;
  disableLoginButton: boolean;
  onPasswordRecovery: () => void;
  onSubmit?(event: FormData);
}

const LoginCard: React.FC<LoginCardProps> = props => {
  const { error, disableLoginButton, onPasswordRecovery, onSubmit } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  let initialFormData = { email: "", password: "" };
  if (DEMO_MODE) {
    initialFormData = {
      email: "admin@example.com",
      password: "admin"
    };
  }

  return (
    <Form initial={initialFormData} onSubmit={onSubmit}>
      {({ change: handleChange, data, submit: handleSubmit }) => (
        <>
          {error && (
            <div className={classes.panel} data-test="loginErrorMessage">
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
              "data-test": "email"
            }}
          />
          <FormSpacer />
          <TextField
            fullWidth
            autoComplete="password"
            label={intl.formatMessage({
              defaultMessage: "Password"
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
          <div className={classes.buttonContainer}>
            <Button
              className={classes.loginButton}
              color="primary"
              disabled={disableLoginButton}
              variant="contained"
              onClick={handleSubmit}
              type="submit"
              data-test="submit"
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
};
LoginCard.displayName = "LoginCard";
export default LoginCard;
