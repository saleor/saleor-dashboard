import { UserContextError } from "@dashboard/auth/types";
import { passwordResetUrl } from "@dashboard/auth/urls";
import { FormSpacer } from "@dashboard/components/FormSpacer";
import { AvailableExternalAuthenticationsQuery } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { CircularProgress, Divider, TextField } from "@material-ui/core";
import { EyeIcon, IconButton } from "@saleor/macaw-ui";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import useStyles from "../styles";
import LoginForm, { LoginFormData } from "./form";
import { getErrorMessage } from "./messages";

export interface LoginCardProps {
  errors: UserContextError[];
  disabled: boolean;
  loading: boolean;
  externalAuthentications?: AvailableExternalAuthenticationsQuery["shop"]["availableExternalAuthentications"];
  onExternalAuthentication: (pluginId: string) => void;
  onSubmit: (event: LoginFormData) => SubmitPromise;
}

const LoginPage: React.FC<LoginCardProps> = props => {
  const {
    errors,
    disabled,
    loading,
    externalAuthentications = [],
    onExternalAuthentication,
    onSubmit,
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
        <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
          <Text size={6} fontWeight="bold" lineHeight={3} marginBottom={4}>
            <FormattedMessage id="vzgZ3U" defaultMessage="Sign In" description="card header" />
          </Text>
          {errors.map(error => (
            <Box
              borderRadius={4}
              padding={4}
              backgroundColor="critical1"
              width="100%"
              marginBottom={5}
              key={error}
              data-test-id="login-error-message"
            >
              <Text color="warning1">{getErrorMessage(error, intl)}</Text>
            </Box>
          ))}
          <TextField
            autoFocus
            fullWidth
            autoComplete="username"
            label={intl.formatMessage(commonMessages.email)}
            name="email"
            onChange={handleChange}
            value={data.email}
            inputProps={{
              "data-test-id": "email",
              spellCheck: false,
            }}
            disabled={disabled}
          />
          <FormSpacer />
          <div className={classes.passwordWrapper}>
            <TextField
              fullWidth
              autoComplete="password"
              label={intl.formatMessage({
                id: "5sg7KC",
                defaultMessage: "Password",
              })}
              name="password"
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              value={data.password}
              inputProps={{
                "data-test-id": "password",
                spellCheck: false,
              }}
              disabled={disabled}
            />
            {/* Not using endAdornment as it looks weird with autocomplete */}
            <IconButton
              className={classes.showPasswordBtn}
              variant="ghost"
              hoverOutline={false}
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
            >
              <EyeIcon />
            </IconButton>
          </div>
          <Text
            // @ts-expect-error - to fix in macaw-ui
            as={Link}
            className={classes.link}
            to={passwordResetUrl}
            fontSize={3}
            data-test-id="reset-password-link"
          >
            <FormattedMessage
              id="3tbL7x"
              defaultMessage="Forgot password?"
              description="description"
            />
          </Text>
          <div className={classes.buttonContainer}>
            <Button
              width="100%"
              disabled={disabled}
              variant="primary"
              onClick={submit}
              type="submit"
              data-test-id="submit"
            >
              <FormattedMessage id="AubJ/S" defaultMessage="Sign in" description="button" />
            </Button>
          </div>
          {externalAuthentications.length > 0 && (
            <>
              <FormSpacer />
              <Divider />
              <FormSpacer />
              <Text>
                <FormattedMessage
                  id="aFU0vm"
                  defaultMessage="or continue with"
                  description="description"
                />
              </Text>
            </>
          )}
          {externalAuthentications.map(externalAuthentication => (
            <React.Fragment key={externalAuthentication.id}>
              <FormSpacer />
              <Button
                width="100%"
                variant="secondary"
                onClick={() => onExternalAuthentication(externalAuthentication.id)}
                data-test-id="external-authentication"
                disabled={disabled}
              >
                {externalAuthentication.name}
              </Button>
            </React.Fragment>
          ))}
        </Box>
      )}
    </LoginForm>
  );
};

LoginPage.displayName = "LoginPage";
export default LoginPage;
