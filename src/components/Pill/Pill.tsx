import { getStatusColor, type PillStatusType } from "@dashboard/misc";
import { Chip, useTheme } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { forwardRef, type HTMLAttributes, type ReactElement, type ReactNode } from "react";

import styles from "./Pill.module.css";

interface PillProps extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  label: ReactNode;
  color: PillStatusType;
  size?: "small" | "medium";
  /** Rendered before the label, e.g. a lucide icon. */
  icon?: ReactElement;
  "data-test-id"?: string;
}

/** Status pill: a macaw-ui-next Chip coloured by `getStatusColor`. */
export const Pill = forwardRef<HTMLDivElement, PillProps>(
  ({ label, color: status, size = "medium", icon, className, style, ...rest }, ref) => {
    const { theme: currentTheme } = useTheme();
    const colors = getStatusColor({ status, currentTheme });

    return (
      <Chip
        {...rest}
        as="div"
        ref={ref}
        className={clsx(styles.pill, size === "small" && styles.small, className)}
        __height={size === "small" ? "24px" : "32px"}
        __borderRadius="32px"
        style={{
          backgroundColor: colors.base,
          borderColor: colors.border,
          color: colors.text,
          ...style,
        }}
      >
        {icon}
        <span className={styles.label}>{label}</span>
      </Chip>
    );
  },
);

Pill.displayName = "Pill";
