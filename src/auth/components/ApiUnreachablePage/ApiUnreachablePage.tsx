import { getIsCloudInstance } from "@dashboard/auth/utils";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AuthButton } from "../AuthButton/AuthButton";
import { AuthWell } from "../AuthWell/AuthWell";
import styles from "./ApiUnreachablePage.module.css";
import { apiUnreachableMessages as messages } from "./messages";

const SALEOR_SUPPORT_HREF = "mailto:support@saleor.io";

interface ApiUnreachablePageProps {
  /** Host of the Saleor API, so a self-hosted setup can spot a wrong address. */
  apiHost: string | null;
  retrying: boolean;
  onRetry: () => void;
  onSignIn: () => void;
  showSupportLink?: boolean;
}

/**
 * Shown instead of the sign-in form when the stored session couldn't be checked at startup
 * because Saleor didn't answer. Signing in can't work while the API is unreachable, and the
 * stored session may still be valid.
 */
export const ApiUnreachablePage = ({
  apiHost,
  retrying,
  onRetry,
  onSignIn,
  showSupportLink = getIsCloudInstance(),
}: ApiUnreachablePageProps): ReactNode => {
  const intl = useIntl();

  return (
    <AuthWell data-test-id="api-unreachable">
      <div className={styles.header}>
        <p className={styles.eyebrow}>
          <span className={styles.signalDot} aria-hidden="true" />
          <span>{intl.formatMessage(messages.kicker)}</span>
        </p>

        <h1 className={styles.title}>{intl.formatMessage(messages.title)}</h1>

        <p className={styles.lede}>{intl.formatMessage(messages.description)}</p>
      </div>

      {apiHost && (
        <p className={styles.hostLine} data-test-id="api-unreachable-host">
          {intl.formatMessage(messages.apiAddress, { host: apiHost })}
        </p>
      )}

      <div className={styles.actions}>
        <AuthButton
          variant="primary"
          loading={retrying}
          onClick={onRetry}
          data-test-id="api-unreachable-retry"
        >
          {intl.formatMessage(messages.tryAgain)}
        </AuthButton>

        <AuthButton
          variant="secondary"
          type="button"
          onClick={onSignIn}
          data-test-id="api-unreachable-sign-in"
        >
          {intl.formatMessage(messages.signIn)}
        </AuthButton>
      </div>

      {showSupportLink && (
        <p className={styles.help}>
          <FormattedMessage
            {...messages.stillStuck}
            values={{
              contactLink: (
                <a href={SALEOR_SUPPORT_HREF} className={styles.helpLink}>
                  <FormattedMessage {...messages.contactSupport} />
                </a>
              ),
            }}
          />
        </p>
      )}
    </AuthWell>
  );
};

ApiUnreachablePage.displayName = "ApiUnreachablePage";
