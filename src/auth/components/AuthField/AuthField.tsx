import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import {
  forwardRef,
  type InputHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useState,
} from "react";

import styles from "./AuthField.module.css";

interface AuthFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  id: string;
  label: ReactNode;
  labelEnd?: ReactNode;
  error?: boolean;
  helperText?: ReactNode;
  showPasswordToggle?: boolean;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
  "data-test-id"?: string;
  passwordToggleTestId?: string;
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  (
    {
      id,
      label,
      labelEnd,
      type = "text",
      error = false,
      helperText,
      showPasswordToggle = false,
      showPasswordLabel = "Show password",
      hidePasswordLabel = "Hide password",
      disabled,
      className,
      "data-test-id": dataTestId,
      passwordToggleTestId,
      ...inputProps
    },
    ref,
  ) => {
    const [revealed, setRevealed] = useState(false);
    const resolvedType = showPasswordToggle ? (revealed ? "text" : "password") : type;
    const helperId = helperText ? `${id}-helper` : undefined;

    const handleToggle = (event: MouseEvent<HTMLButtonElement>): void => {
      event.preventDefault();
      event.stopPropagation();
      setRevealed(prev => !prev);
    };

    return (
      <div className={clsx(styles.field, className)}>
        <div className={styles.labelRow}>
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
          {labelEnd}
        </div>

        <div className={styles.inputWrap}>
          <input
            {...inputProps}
            ref={ref}
            id={id}
            type={resolvedType}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={helperId}
            data-test-id={dataTestId}
            className={clsx(
              styles.input,
              showPasswordToggle && styles.inputWithToggle,
              error && styles.inputError,
            )}
          />

          {showPasswordToggle && (
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={handleToggle}
              aria-label={revealed ? hidePasswordLabel : showPasswordLabel}
              aria-pressed={revealed}
              disabled={disabled}
              data-test-id={passwordToggleTestId}
            >
              {revealed ? (
                <EyeOff size={16} aria-hidden="true" />
              ) : (
                <Eye size={16} aria-hidden="true" />
              )}
            </button>
          )}
        </div>

        {helperText && (
          <p id={helperId} className={clsx(styles.helperText, error && styles.helperTextError)}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

AuthField.displayName = "AuthField";
