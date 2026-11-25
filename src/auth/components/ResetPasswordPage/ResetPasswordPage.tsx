import { useLastLoginMethod } from "@dashboard/auth/hooks/useLastLoginMethod";
import Form from "@dashboard/components/Form/Form";
import { getAppMountUri } from "@dashboard/config";
import { type AccountErrorCode } from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { ArrowLeft } from "lucide-react";
import { type ReactNode } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { AuthButton } from "../AuthButton/AuthButton";
import { AuthField } from "../AuthField/AuthField";
import { AuthNotice } from "../AuthNotice/AuthNotice";
import { AuthWell } from "../AuthWell/AuthWell";
import { ChangingPasswordWarning } from "../ChangingPasswordWarning";
import styles from "./ResetPasswordPage.module.css";

const resetPasswordMessages = defineMessages({
  backToSignIn: {
    id: "sqP2Sp",
    defaultMessage: "Back to sign in",
    description: "aria-label for back button to sign in screen",
  },
  title: {
    id: "Yy/yDL",
    defaultMessage: "Reset password",
  },
  description: {
    id: "xnrSs5",
    defaultMessage:
      "Enter your email. If it matches an account, we’ll send you a reset link shortly.",
  },
  submitButton: {
    id: "lm9NSK",
    defaultMessage: "Send an email with reset link",
    description: "password reset, button",
  },
  rememberedPrompt: {
    id: "f3NBH+",
    defaultMessage: "Remembered it? {loginLink}",
    description: "secondary prompt below reset password submit button",
  },
  backToLogin: {
    id: "WNW5VT",
    defaultMessage: "Back to login",
    description: "link back to login screen",
  },
});

export interface ResetPasswordPageFormData {
  email: string;
}

interface ResetPasswordPageProps {
  disabled: boolean;
  error?: string;
  onSubmit: (data: ResetPasswordPageFormData) => SubmitPromise<AccountErrorCode[]>;
}

export const ResetPasswordPage = ({
  disabled,
  error,
  onSubmit,
}: ResetPasswordPageProps): ReactNode => {
  const intl = useIntl();
  const { hasUserLoggedViaExternalMethod } = useLastLoginMethod();
  const loginHref = getAppMountUri();

  return (
    <AuthWell>
      <div className={styles.header}>
        <Link
          to={loginHref}
          className={styles.backButton}
          data-auth-link-button="true"
          aria-label={intl.formatMessage(resetPasswordMessages.backToSignIn)}
          data-test-id="back-to-login-link"
        >
          <ArrowLeft size={16} aria-hidden="true" />
        </Link>

        <h1 className={styles.title}>
          <FormattedMessage {...resetPasswordMessages.title} />
        </h1>
        <p className={styles.lede}>
          <FormattedMessage {...resetPasswordMessages.description} />
        </p>
      </div>

      {(!!error || hasUserLoggedViaExternalMethod) && (
        <div className={styles.notices}>
          {!!error && <AuthNotice tone="error">{error}</AuthNotice>}
          {hasUserLoggedViaExternalMethod && <ChangingPasswordWarning />}
        </div>
      )}

      <Form initial={{ email: "" }} onSubmit={onSubmit}>
        {({ change: handleChange, data, submit: handleSubmit }) => (
          <div className={styles.fields}>
            <AuthField
              autoFocus
              disabled={disabled}
              autoComplete="username"
              label={intl.formatMessage(commonMessages.email)}
              id="email"
              name="email"
              type="email"
              onChange={handleChange}
              value={data.email}
              data-test-id="email"
              spellCheck={false}
              required
            />

            <AuthButton
              className={styles.actionButton}
              data-test-id="submit"
              loading={disabled}
              variant="primary"
              onClick={handleSubmit}
              type="submit"
            >
              <FormattedMessage {...resetPasswordMessages.submitButton} />
            </AuthButton>
          </div>
        )}
      </Form>

      <p className={styles.help}>
        <FormattedMessage
          {...resetPasswordMessages.rememberedPrompt}
          values={{
            loginLink: (
              <Link to={loginHref} className={styles.helpLink}>
                <FormattedMessage {...resetPasswordMessages.backToLogin} />
              </Link>
            ),
          }}
        />
      </p>
    </AuthWell>
  );
};

ResetPasswordPage.displayName = "ResetPasswordPage";
