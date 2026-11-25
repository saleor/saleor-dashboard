import { type ReactNode } from "react";
import { defineMessages, FormattedMessage } from "react-intl";

import { AuthButton } from "../AuthButton/AuthButton";
import { AuthWell } from "../AuthWell/AuthWell";
import styles from "./ResetPasswordSuccessPage.module.css";

const resetPasswordSuccessMessages = defineMessages({
  eyebrow: {
    id: "SFjTGt",
    defaultMessage: "All set",
    description: "eyebrow on password reset confirmation page",
  },
  title: {
    id: "t5Og1p",
    defaultMessage: "Check your email",
    description: "heading on password reset confirmation page",
  },
  description: {
    id: "HUqG6y",
    defaultMessage:
      "In a few minutes you’ll receive a message with instructions on how to reset your password.",
  },
  backButton: {
    id: "2oyWT9",
    defaultMessage: "Back to login",
    description: "button",
  },
  helpText: {
    id: "2FS/p2",
    defaultMessage: "Didn’t arrive? Check spam, or try again in five minutes.",
    description: "hint below back to login button on reset confirmation screen",
  },
});

interface ResetPasswordSuccessPageProps {
  onBack: () => void;
}

export const ResetPasswordSuccessPage = ({ onBack }: ResetPasswordSuccessPageProps): ReactNode => (
  <AuthWell>
    <div className={styles.header}>
      <p className={styles.eyebrow}>
        <FormattedMessage {...resetPasswordSuccessMessages.eyebrow} />
      </p>

      <h1 className={styles.title}>
        <FormattedMessage {...resetPasswordSuccessMessages.title} />
      </h1>

      <p className={styles.lede}>
        <FormattedMessage {...resetPasswordSuccessMessages.description} />
      </p>
    </div>

    <AuthButton
      className={styles.actionButton}
      variant="primary"
      onClick={onBack}
      type="button"
      data-test-id="back-to-login-button"
    >
      <FormattedMessage {...resetPasswordSuccessMessages.backButton} />
    </AuthButton>

    <p className={styles.help}>
      <FormattedMessage {...resetPasswordSuccessMessages.helpText} />
    </p>
  </AuthWell>
);

ResetPasswordSuccessPage.displayName = "ResetPasswordSuccessPage";
