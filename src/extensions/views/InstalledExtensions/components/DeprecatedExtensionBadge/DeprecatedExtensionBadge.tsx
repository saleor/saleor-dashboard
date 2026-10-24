import { commonMessages } from "@dashboard/intl";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import styles from "./DeprecatedExtensionBadge.module.css";

/** Installed legacy app that still opens, and should not be the path for a new setup. */
export const DeprecatedExtensionBadge = (): ReactNode => (
  <span className={styles.badge} data-test-id="deprecated-extension-badge">
    <FormattedMessage {...commonMessages.deprecated} />
  </span>
);
