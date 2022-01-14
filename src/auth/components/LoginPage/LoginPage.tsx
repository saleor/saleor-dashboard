import {
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
import { Button, EyeIcon, IconButton } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import useStyles from "../styles";
import LoginForm, { LoginFormData } from "./form";
import { getErrorMessage } from "./messages";

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
  const [showPassword, setShowPassword] = React.useState(false);

  if (loading) {
    return (
      <div className={classes.loading}>
        <CircularProgress size={128} />
      </div>
    );
  }

  return (
    <LoginForm onSubmit={onSubmit}>
      {({ change: handleChange, data, submit }) => (
        <>
          <Typography variant="h3" className={classes.header}>
            <FormattedMessage
              defaultMessage="Sign In"
              description="card header"
            />
          </Typography>
          {error && (
            <div className={classes.panel} data-test="loginErrorMessage">
              {getErrorMessage(error, intl)}
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
          <div className={classes.passwordWrapper}>
            <TextField
              fullWidth
              autoComplete="password"
              label={intl.formatMessage({
                defaultMessage: "Password"
              })}
              name="password"
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              value={data.password}
              inputProps={{
                "data-test": "password"
              }}
              disabled={disabled}
            />
            {/* Not using endAdornment as it looks weird with autocomplete */}
            <IconButton
              className={classes.showPasswordBtn}
              variant="secondary"
              hoverOutline={false}
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
            >
              <EyeIcon />
            </IconButton>
          </div>
          <Typography
            component="a"
            className={classes.link}
            onClick={onPasswordRecovery}
            variant="body2"
          >
            <FormattedMessage
              defaultMessage="Forgot password?"
              description="description"
            />
          </Typography>
          <div className={classes.buttonContainer}>
            <Button
              className={classes.loginButton}
              disabled={disabled}
              variant="primary"
              onClick={submit}
              type="submit"
              data-test="submit"
            >
              <FormattedMessage defaultMessage="Sign in" description="button" />
            </Button>
          </div>
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
                fullWidth
                variant="secondary"
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
