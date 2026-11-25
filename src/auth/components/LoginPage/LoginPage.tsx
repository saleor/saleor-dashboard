import { type LastLoginMethod } from "@dashboard/auth/hooks/useLastLoginMethod";
import { type UserContextError } from "@dashboard/auth/types";
import { passwordResetUrl } from "@dashboard/auth/urls";
import { getExternalAuthenticationMethodName, getIsCloudInstance } from "@dashboard/auth/utils";
import { SaleorThrobber } from "@dashboard/components/Throbber/SaleorThrobber";
import { type AvailableExternalAuthenticationsQuery } from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { ArrowRight } from "lucide-react";
import { type ReactNode, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { AuthButton } from "../AuthButton/AuthButton";
import { AuthField } from "../AuthField/AuthField";
import { AuthNotice } from "../AuthNotice/AuthNotice";
import { AuthWell } from "../AuthWell/AuthWell";
import { LoginForm, type LoginFormData } from "./form";
import { LastLoginIndicator } from "./LastLoginIndicator";
import styles from "./LoginPage.module.css";
import { getErrorMessage, loginPageMessages } from "./messages";

const SALEOR_SUPPORT_HREF = "mailto:support@saleor.io";

interface LoginCardProps {
  errors: UserContextError[];
  disabled: boolean;
  loading: boolean;
  externalAuthentications?: AvailableExternalAuthenticationsQuery["shop"]["availableExternalAuthentications"];
  passwordLoginEnabled: boolean;
  /** The login methods request failed, so which methods the shop offers is unknown. */
  loginMethodsError?: boolean;
  onRetryLoginMethods?: () => void;
  onExternalAuthentication: (pluginId: string) => void;
  onSubmit: (event: LoginFormData) => SubmitPromise;
  lastLoginMethod: LastLoginMethod;
  showSupportLink?: boolean;
}

/** What the card shows while it has no login method to offer. */
type LoginMethodsFallbackState = "loading" | "failed" | "passwordLoginDisabled";

const getLoginMethodsFallbackState = ({
  passwordLoginEnabled,
  externalAuthentications,
  loading,
  loginMethodsError,
}: Pick<
  LoginCardProps,
  "passwordLoginEnabled" | "externalAuthentications" | "loading" | "loginMethodsError"
>): LoginMethodsFallbackState | null => {
  if (passwordLoginEnabled || (externalAuthentications?.length ?? 0) > 0) {
    return null;
  }

  if (loading) {
    return "loading";
  }

  if (!externalAuthentications) {
    return loginMethodsError ? "failed" : "loading";
  }

  return "passwordLoginDisabled";
};

const LoginMethodsFallback = ({
  state,
  onRetry,
}: {
  state: LoginMethodsFallbackState;
  onRetry?: () => void;
}): ReactNode => {
  const intl = useIntl();

  switch (state) {
    case "loading":
      return (
        <div className={styles.spinnerWrap} data-test-id="login-methods-loading">
          <SaleorThrobber
            size={28}
            label={intl.formatMessage(loginPageMessages.loadingLoginMethods)}
          />
        </div>
      );
    case "failed":
      return (
        <div className={styles.loginMethodsError}>
          <AuthNotice tone="error" data-test-id="login-methods-error">
            {intl.formatMessage(loginPageMessages.loginMethodsUnavailable)}
          </AuthNotice>
          {onRetry && (
            <AuthButton variant="secondary" onClick={onRetry} data-test-id="login-methods-retry">
              <FormattedMessage {...buttonMessages.retry} />
            </AuthButton>
          )}
        </div>
      );
    case "passwordLoginDisabled":
      return (
        <AuthNotice tone="info">
          {intl.formatMessage(loginPageMessages.passwordLoginDisabled)}
        </AuthNotice>
      );
    default: {
      const _exhaustive: never = state;

      return _exhaustive;
    }
  }
};

export const LoginPage = ({
  errors,
  disabled,
  loading,
  externalAuthentications,
  passwordLoginEnabled,
  loginMethodsError = false,
  onRetryLoginMethods,
  onExternalAuthentication,
  onSubmit,
  lastLoginMethod,
  showSupportLink = getIsCloudInstance(),
}: LoginCardProps): ReactNode => {
  const intl = useIntl();
  const [optimisticLoaderAuthId, setOptimisticLoaderAuthId] = useState<null | string>(null);
  const hasExternalAuthentications = (externalAuthentications?.length ?? 0) > 0;
  const loginMethodsFallback = getLoginMethodsFallbackState({
    passwordLoginEnabled,
    externalAuthentications,
    loading,
    loginMethodsError,
  });
  const showLastLoginIndicatorForPassword =
    lastLoginMethod === "password" && hasExternalAuthentications;
  const showSubtitle = passwordLoginEnabled || hasExternalAuthentications;

  return (
    <div className={styles.wrapper}>
      <AuthWell>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <FormattedMessage {...loginPageMessages.signInHeader} />
          </h1>
          {showSubtitle && (
            <p className={styles.lede}>
              <FormattedMessage {...loginPageMessages.signInSubtitle} />
            </p>
          )}
        </div>

        {errors.length > 0 && (
          <div className={styles.notices}>
            {errors.map(error => (
              <AuthNotice tone="error" key={error} data-test-id="login-error-message">
                {getErrorMessage(error, intl)}
              </AuthNotice>
            ))}
          </div>
        )}

        {passwordLoginEnabled && (
          <LoginForm onSubmit={onSubmit}>
            {({ change: handleChange, data }) => (
              <div className={styles.fields}>
                <AuthField
                  autoFocus
                  autoComplete="username"
                  label={intl.formatMessage(commonMessages.email)}
                  id="email"
                  name="email"
                  type="email"
                  onChange={handleChange}
                  value={data.email}
                  data-test-id="email"
                  spellCheck={false}
                  disabled={disabled}
                  required
                />

                <AuthField
                  label={intl.formatMessage(loginPageMessages.passwordLabel)}
                  labelEnd={
                    <Link
                      to={passwordResetUrl}
                      className={styles.forgotLink}
                      data-test-id="reset-password-link"
                    >
                      <FormattedMessage {...loginPageMessages.forgotPassword} />
                    </Link>
                  }
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  onChange={handleChange}
                  value={data.password}
                  data-test-id="password"
                  passwordToggleTestId="password-visibility-toggle"
                  showPasswordToggle
                  showPasswordLabel={intl.formatMessage(loginPageMessages.showPassword)}
                  hidePasswordLabel={intl.formatMessage(loginPageMessages.hidePassword)}
                  spellCheck={false}
                  disabled={disabled}
                  required
                />

                <AuthButton
                  className={styles.actionButton}
                  disabled={disabled}
                  loading={loading}
                  variant="primary"
                  type={disabled ? "button" : "submit"}
                  data-test-id="submit"
                  aria-describedby={
                    showLastLoginIndicatorForPassword ? "auth-last-used" : undefined
                  }
                  badge={
                    showLastLoginIndicatorForPassword ? (
                      <LastLoginIndicator id="auth-last-used" />
                    ) : undefined
                  }
                >
                  <FormattedMessage {...loginPageMessages.signInButton} />
                  <ArrowRight size={14} className={styles.submitArrow} aria-hidden="true" />
                </AuthButton>
              </div>
            )}
          </LoginForm>
        )}

        {loginMethodsFallback && (
          <LoginMethodsFallback state={loginMethodsFallback} onRetry={onRetryLoginMethods} />
        )}

        {hasExternalAuthentications && (
          <>
            {passwordLoginEnabled && (
              <div className={styles.divider} role="separator">
                <span className={styles.dividerLabel}>
                  <FormattedMessage {...loginPageMessages.orDivider} />
                </span>
              </div>
            )}

            <div className={styles.externalList}>
              {externalAuthentications?.map(externalAuthentication => {
                const isLastUsed = lastLoginMethod === externalAuthentication.id;
                const isLoading = optimisticLoaderAuthId === externalAuthentication.id;

                return (
                  <AuthButton
                    key={externalAuthentication.id}
                    className={styles.actionButton}
                    variant={passwordLoginEnabled ? "secondary" : "primary"}
                    type="button"
                    onClick={() => {
                      onExternalAuthentication(externalAuthentication.id);
                      setOptimisticLoaderAuthId(externalAuthentication.id);
                    }}
                    data-test-id="external-authentication"
                    disabled={disabled && !isLoading}
                    loading={isLoading}
                    aria-describedby={isLastUsed ? "auth-last-used" : undefined}
                    badge={isLastUsed ? <LastLoginIndicator id="auth-last-used" /> : undefined}
                  >
                    {getExternalAuthenticationMethodName({
                      pluginId: externalAuthentication.id,
                      intl,
                    }) || externalAuthentication.name}
                  </AuthButton>
                );
              })}
            </div>
          </>
        )}
      </AuthWell>

      {showSupportLink && (
        <p className={styles.below}>
          <FormattedMessage
            {...loginPageMessages.needHelp}
            values={{
              contactLink: (
                <a href={SALEOR_SUPPORT_HREF} className={styles.belowLink}>
                  <FormattedMessage {...loginPageMessages.contactSupport} />
                </a>
              ),
            }}
          />
        </p>
      )}
    </div>
  );
};

LoginPage.displayName = "LoginPage";
