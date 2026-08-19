import { iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Text, type TextProps } from "@saleor/macaw-ui-next";
import { AppWindow, Gift, Globe, Package, Tag, User, Users } from "lucide-react";
import { type ReactNode } from "react";
import { Link } from "react-router-dom";

import styles from "./TimelineLink.module.css";

/** Dashboard entities that get a leading icon in timeline copy. */
export type TimelineEntity =
  | "order"
  | "customer"
  | "staff"
  | "app"
  | "product"
  | "giftCard"
  | "channel";

const ENTITY_ICONS = {
  order: Package,
  customer: User,
  staff: Users,
  app: AppWindow,
  product: Tag,
  giftCard: Gift,
  channel: Globe,
} as const;

/** Compact glyph sized for Text size={3} timeline sentences. */
const TIMELINE_LINK_ICON_SIZE = 12;

interface TimelineLinkProps {
  href: string;
  children: ReactNode;
  /** When set, renders the matching entity icon before the label. */
  entity?: TimelineEntity;
  /** Match surrounding timeline copy (`default1` body, `default2` attribution). */
  color?: Extract<TextProps["color"], "default1" | "default2">;
  /** Macaw text size; defaults to timeline body (`3`). */
  size?: TextProps["size"];
}

/**
 * Inline timeline link: text-colored (not accent blue), underline on hover,
 * optional Saleor-entity icon (order, customer, staff, …).
 */
export const TimelineLink = ({
  href,
  children,
  entity,
  color = "default1",
  size = 3,
}: TimelineLinkProps) => {
  const Icon = entity ? ENTITY_ICONS[entity] : null;

  return (
    <Link to={href} className={styles.link}>
      {Icon ? (
        <Icon
          size={TIMELINE_LINK_ICON_SIZE}
          strokeWidth={iconStrokeWidthBySize.small}
          aria-hidden
          className={styles.icon}
        />
      ) : null}
      <Text as="span" size={size} color={color} className={styles.label}>
        {children}
      </Text>
    </Link>
  );
};
