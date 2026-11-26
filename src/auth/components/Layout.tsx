import { useTheme } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type ReactNode } from "react";
import { defineMessages, FormattedMessage } from "react-intl";

import { useUser } from "../useUser";
import { getIsCloudInstance } from "../utils";
import styles from "./Layout.module.css";
import { LoginLoading } from "./LoginLoading/LoginLoading";
import { SaleorWordmark } from "./SaleorWordmark/SaleorWordmark";
import { WavePattern } from "./WavePattern/WavePattern";

const layoutMessages = defineMessages({
  termsOfUse: {
    id: "SpCeoK",
    defaultMessage: "Terms of Use",
    description: "legal footer link to Saleor Terms of Use",
  },
  privacyPolicy: {
    id: "rrQA6H",
    defaultMessage: "Privacy Policy",
    description: "legal footer link to Saleor Privacy Policy",
  },
});

const SALEOR_TERMS_URL = "https://saleor.io/legal/terms/";
const SALEOR_PRIVACY_URL = "https://saleor.io/legal/privacy/";

interface AuthShellProps {
  children: ReactNode;
  isCloudInstance?: boolean;
}

export const AuthShell = ({ children, isCloudInstance = false }: AuthShellProps): ReactNode => {
  const { theme } = useTheme();
  const isDark = theme === "defaultDark";

  return (
    <div className={clsx(styles.root, isDark && styles.rootDark)}>
      <div className={styles.wavesColumn} aria-hidden="true">
        <WavePattern />
      </div>

      <div className={clsx(styles.gridLine, styles.line1)} aria-hidden="true" />
      <div className={clsx(styles.gridLine, styles.line2)} aria-hidden="true" />
      <div className={clsx(styles.gridLine, styles.line3)} aria-hidden="true" />
      <div className={clsx(styles.gridLine, styles.line4)} aria-hidden="true" />
      <div className={clsx(styles.gridLine, styles.line5)} aria-hidden="true" />

      <div className={styles.content}>
        <header className={styles.header}>
          <SaleorWordmark />
        </header>

        <main className={styles.stage}>{children}</main>

        <footer className={styles.legal}>
          {isCloudInstance && (
            <>
              <a
                href={SALEOR_TERMS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.legalLink}
              >
                <FormattedMessage {...layoutMessages.termsOfUse} />
              </a>
              <a
                href={SALEOR_PRIVACY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.legalLink}
              >
                <FormattedMessage {...layoutMessages.privacyPolicy} />
              </a>
            </>
          )}
        </footer>
      </div>
    </div>
  );
};

AuthShell.displayName = "AuthShell";

export const Layout = ({ children }: { children: ReactNode }): ReactNode => {
  const { errors } = useUser();

  // Show fullscreen loading when there is externalLoginError — we redirect and
  // log out the user in the meantime.
  if (errors.some(item => item === "externalLoginError")) {
    return <LoginLoading />;
  }

  return <AuthShell isCloudInstance={getIsCloudInstance()}>{children}</AuthShell>;
};

Layout.displayName = "Layout";
