import { SaleorThrobber } from "@dashboard/components/Throbber/SaleorThrobber";
import clsx from "clsx";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

import styles from "./AuthButton.module.css";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  loading?: boolean;
  badge?: ReactNode;
  "data-test-id"?: string;
}

export const AuthButton = ({
  variant = "primary",
  loading = false,
  badge,
  disabled,
  onClick,
  type = "button",
  className,
  children,
  "data-test-id": dataTestId,
  ...rest
}: AuthButtonProps): ReactNode => (
  <button
    {...rest}
    type={loading ? "button" : type}
    disabled={disabled && !loading}
    aria-busy={loading}
    tabIndex={loading ? -1 : rest.tabIndex}
    onClick={loading ? undefined : onClick}
    data-test-id={dataTestId}
    data-test-state={loading ? "loading" : "default"}
    className={clsx(
      styles.button,
      variant === "primary" ? styles.primary : styles.secondary,
      className,
    )}
  >
    {loading && (
      <SaleorThrobber size={20} data-test-id="button-progress" className={styles.throbber} />
    )}
    <span className={clsx(styles.label, loading && styles.labelHidden)}>{children}</span>
    {badge}
  </button>
);

AuthButton.displayName = "AuthButton";
