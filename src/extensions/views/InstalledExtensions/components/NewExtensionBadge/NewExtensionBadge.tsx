import { infoMessages } from "@dashboard/extensions/messages";
import { FormattedMessage } from "react-intl";

import styles from "./NewExtensionBadge.module.css";

export const NewExtensionBadge = () => (
  <span className={styles.newBadge} data-test-id="new-extension-badge">
    <FormattedMessage {...infoMessages.newExtension} />
  </span>
);
