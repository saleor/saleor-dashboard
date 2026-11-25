import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import styles from "./LastLoginIndicator.module.css";

interface LastLoginIndicatorProps {
  id?: string;
}

export const LastLoginIndicator = ({ id }: LastLoginIndicatorProps): ReactNode => {
  const { formatMessage } = useIntl();

  return (
    <span id={id} aria-hidden="true" className={styles.badge}>
      {formatMessage({
        id: "AR/VVX",
        defaultMessage: "Last used",
        description: "Indicates last login method user used",
      })}
    </span>
  );
};

LastLoginIndicator.displayName = "LastLoginIndicator";
