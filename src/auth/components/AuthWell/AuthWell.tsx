import clsx from "clsx";
import { type ReactNode } from "react";

import styles from "./AuthWell.module.css";

interface AuthWellProps {
  children: ReactNode;
  className?: string;
  "data-test-id"?: string;
}

export const AuthWell = ({
  children,
  className,
  "data-test-id": dataTestId,
}: AuthWellProps): ReactNode => (
  <div className={clsx(styles.well, className)} data-test-id={dataTestId}>
    {children}
  </div>
);

AuthWell.displayName = "AuthWell";
