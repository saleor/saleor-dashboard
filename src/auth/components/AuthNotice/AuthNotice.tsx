import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type ReactNode } from "react";

import styles from "./AuthNotice.module.css";

type AuthNoticeTone = "error" | "warning" | "info" | "success";

interface AuthNoticeProps {
  tone: AuthNoticeTone;
  children: ReactNode;
  blink?: boolean;
  className?: string;
  "data-test-id"?: string;
}

const getToneClassName = (tone: AuthNoticeTone): string => {
  switch (tone) {
    case "error":
      return styles.toneError;
    case "warning":
      return styles.toneWarning;
    case "info":
      return styles.toneInfo;
    case "success":
      return styles.toneSuccess;
    default: {
      const _exhaustive: never = tone;

      return _exhaustive;
    }
  }
};

/**
 * Monochrome inline alert with a single semantic signal light (dot + soft halo).
 * Mirrors saleor-branding / saleor-cloud-console `ds-notice` restraint.
 */
export const AuthNotice = ({
  tone,
  children,
  blink = false,
  className,
  "data-test-id": dataTestId,
}: AuthNoticeProps): ReactNode => (
  <div
    role={tone === "error" || tone === "warning" ? "alert" : "status"}
    className={clsx(styles.notice, getToneClassName(tone), className)}
    data-test-id={dataTestId}
  >
    <span className={clsx(styles.dot, blink && styles.dotBlink)} aria-hidden="true" />
    <Text size={2} color="default1" className={styles.body}>
      {children}
    </Text>
  </div>
);

AuthNotice.displayName = "AuthNotice";
