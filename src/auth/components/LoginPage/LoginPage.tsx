import {
  Button,
  CircularProgress,
  Divider,
  TextField,
  Typography
} from "@material-ui/core";
import { UserContextError } from "@saleor/auth/types";
import { AvailableExternalAuthentications_shop_availableExternalAuthentications } from "@saleor/auth/types/AvailableExternalAuthentications";
import { FormSpacer } from "@saleor/components/FormSpacer";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { commonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import LoginForm, { LoginFormData } from "./form";
import { getErrorMessage } from "./messages";

const useStyles = makeStyles(
  theme => ({
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end"
    },
    link: {
      color: theme.palette.primary.main,
      cursor: "pointer",
      textDecoration: "underline"
    },
    loading: {
      alignItems: "center",
      display: "flex",
      minHeight: "80vh",
      justifyContent: "center"
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
  error?: UserContextError;
  disabled: boolean;
  loading: boolean;
  externalAuthentications?: AvailableExternalAuthentications_shop_availableExternalAuthentications[];
  onExternalAuthentication: (pluginId: string) => void;
  onPasswordRecovery: () => void;
  onSubmit?: (event: LoginFormData) => SubmitPromise;
}

const LoginCard: React.FC<LoginCardProps> = props => {
  const {
    error,
    disabled,
    loading,
    externalAuthentications = [],
    onExternalAuthentication,
    onPasswordRecovery,
    onSubmit
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  if (loading) {
    return (
      <div className={classes.loading}>
        <CircularProgress size={128} />
      </div>
    );
  }

  return (
    <LoginForm onSubmit={onSubmit}>
      {({ change: handleChange, data }) => (
        <>
          {error && (
            <div className={classes.panel} data-test="loginErrorMessage">
              <Typography variant="caption">
                {getErrorMessage(error, intl)}
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
            disabled={disabled}
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
            disabled={disabled}
          />
          <FormSpacer />
          <div className={classes.buttonContainer}>
            <Button
              className={classes.loginButton}
              color="primary"
              disabled={disabled}
              variant="contained"
              type="submit"
              data-test="submit"
            >
              <FormattedMessage defaultMessage="Login" description="button" />
            </Button>
          </div>
          <FormSpacer />
          <Typography>
            <FormattedMessage
              defaultMessage="Forgot password? {resetPasswordLink}"
              description="description"
              values={{
                resetPasswordLink: (
                  <a
                    className={classes.link}
                    onClick={onPasswordRecovery}
                    data-test-id="reset-password-link"
                  >
                    <FormattedMessage
                      defaultMessage="Use this link to recover it"
                      description="link"
                    />
                  </a>
                )
              }}
            />
          </Typography>
          {externalAuthentications.length > 0 && (
            <>
              <FormSpacer />
              <Divider />
              <FormSpacer />
              <Typography>
                <FormattedMessage
                  defaultMessage="or login using"
                  description="description"
                />
              </Typography>
            </>
          )}
          {externalAuthentications.map(externalAuthentication => (
            <React.Fragment key={externalAuthentication.id}>
              <FormSpacer />
              <Button
                color="primary"
                fullWidth
                variant="outlined"
                onClick={() =>
                  onExternalAuthentication(externalAuthentication.id)
                }
                data-test="external-authentication"
                disabled={disabled}
              >
                {externalAuthentication.name}
              </Button>
            </React.Fragment>
          ))}
        </>
      )}
    </LoginForm>
  );
};
LoginCard.displayName = "LoginCard";
export default LoginCard;
