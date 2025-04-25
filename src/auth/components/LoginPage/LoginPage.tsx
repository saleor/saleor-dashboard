import { UserContextError } from "@dashboard/auth/types";
import { passwordResetUrl } from "@dashboard/auth/urls";
import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import { FormSpacer } from "@dashboard/components/FormSpacer";
import { AvailableExternalAuthenticationsQuery } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { EyeIcon } from "@saleor/macaw-ui";
import { Box, Button, Divider, Input, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [optimisticLoaderAuthId, setOptimisticLoaderAuthId] = useState<null | string>(null);

  return (
    <LoginForm onSubmit={onSubmit}>
      {({ change: handleChange, data }) => (
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
              marginBottom={2}
              key={error}
              data-test-id="login-error-message"
            >
              <Text color="critical2">{getErrorMessage(error, intl)}</Text>
            </Box>
          ))}
          <Input
            autoFocus
            width="100%"
            autoComplete="email"
            label={intl.formatMessage(commonMessages.email)}
            id="email"
            name="email"
            onChange={handleChange}
            value={data.email}
            data-test-id="email"
            spellCheck={false}
            disabled={disabled}
            required
          />
          <FormSpacer />
          <Input
            width="100%"
            label={intl.formatMessage({
              id: "5sg7KC",
              defaultMessage: "Password",
            })}
            id="password"
            name="password"
            autoComplete="current-password"
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            value={data.password}
            data-test-id="password"
            spellCheck={false}
            disabled={disabled}
            endAdornment={
              <Button
                icon={<EyeIcon />}
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                variant="tertiary"
                type="button"
              />
            }
            required
          />
          <Link to={passwordResetUrl}>
            <Text className={classes.link} fontSize={3} data-test-id="reset-password-link">
              <FormattedMessage
                id="3tbL7x"
                defaultMessage="Forgot password?"
                description="description"
              />
            </Text>
          </Link>

          <div className={classes.buttonContainer}>
            <ButtonWithLoader
              width="100%"
              disabled={disabled}
              variant="primary"
              type="submit"
              transitionState={loading ? "loading" : "default"}
              data-test-id="submit"
            >
              <FormattedMessage id="AubJ/S" defaultMessage="Sign in" description="button" />
            </ButtonWithLoader>
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
              <ButtonWithLoader
                width="100%"
                variant="secondary"
                onClick={() => {
                  onExternalAuthentication(externalAuthentication.id);
                  setOptimisticLoaderAuthId(externalAuthentication.id);
                }}
                data-test-id="external-authentication"
                disabled={disabled}
                transitionState={
                  optimisticLoaderAuthId === externalAuthentication.id ? "loading" : "default"
                }
              >
                {externalAuthentication.name}
              </ButtonWithLoader>
            </React.Fragment>
          ))}
        </Box>
      )}
    </LoginForm>
  );
};

LoginPage.displayName = "LoginPage";
export default LoginPage;
