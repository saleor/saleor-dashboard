import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { AlertTriangle, Info, type LucideIcon, XCircle } from "lucide-react";
import { type ReactNode } from "react";

import styles from "./Callout.module.css";

export type CalloutType = "info" | "warning" | "error";

interface CalloutVariant {
  Icon: LucideIcon;
  className: string;
}

const calloutVariants: Record<CalloutType, CalloutVariant> = {
  info: {
    Icon: Info,
    className: styles.info,
  },
  warning: {
    Icon: AlertTriangle,
    className: styles.warning,
  },
  error: {
    // Match toast error affordance.
    Icon: XCircle,
    className: styles.error,
  },
};

interface CalloutProps {
  type: CalloutType;
  /** Primary line — required for a11y identity of the callout. */
  title: ReactNode;
  /** Optional secondary detail under the title. */
  children?: ReactNode;
  className?: string;
  "data-test-id"?: string;
}

/**
 * Section callout for inline guidance or errors.
 * Neutral default1 surface + border; status via icon / border / title color only.
 */
export const Callout = ({
  type,
  title,
  children,
  className,
  "data-test-id": dataTestId,
}: CalloutProps): JSX.Element => {
  const { Icon, className: typeClassName } = calloutVariants[type];
  const rootClassName = [styles.callout, typeClassName, className].filter(Boolean).join(" ");

  return (
    <div
      className={rootClassName}
      role={type === "error" || type === "warning" ? "alert" : "status"}
      data-test-id={dataTestId}
    >
      <div className={styles.icon} aria-hidden>
        <Icon size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
      </div>
      <div className={styles.body}>
        <div className={styles.title}>{title}</div>
        {children ? <div className={styles.description}>{children}</div> : null}
      </div>
    </div>
  );
};
