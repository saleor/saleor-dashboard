import { Text } from "@saleor/macaw-ui-next";
import { Info, type LucideIcon, TriangleAlert } from "lucide-react";
import { type ReactNode } from "react";

import styles from "./BulkPublishCallout.module.css";

type BulkPublishCalloutVariant = "info" | "warning";

interface BulkPublishCalloutProps {
  variant: BulkPublishCalloutVariant;
  title?: ReactNode;
  children: ReactNode;
}

const variantConfig: Record<
  BulkPublishCalloutVariant,
  { className: string; Icon: LucideIcon; textColor: "default1" | "default2" }
> = {
  info: {
    className: styles.calloutInfo,
    Icon: Info,
    textColor: "default2",
  },
  warning: {
    className: styles.calloutWarning,
    Icon: TriangleAlert,
    textColor: "default1",
  },
};

export const BulkPublishCallout = ({ variant, title, children }: BulkPublishCalloutProps) => {
  const { className, Icon, textColor } = variantConfig[variant];

  return (
    <div className={`${styles.callout} ${className}`}>
      <div className={styles.icon}>
        <Icon size={16} aria-hidden />
      </div>
      <div className={styles.content}>
        {title ? (
          <Text size={2} fontWeight="medium" color={textColor}>
            {title}
          </Text>
        ) : null}
        <Text size={2} color={textColor}>
          {children}
        </Text>
      </div>
    </div>
  );
};
