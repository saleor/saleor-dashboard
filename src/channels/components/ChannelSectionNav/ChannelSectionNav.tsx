import { Box, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { type ChannelSectionId } from "./channelSectionIds";
import styles from "./ChannelSectionNav.module.css";
import { messages } from "./messages";

export interface ChannelSectionNavItem {
  id: ChannelSectionId;
  label: string;
}

interface ChannelSectionNavProps {
  items: ChannelSectionNavItem[];
  activeId?: ChannelSectionId;
  onSelect: (sectionId: ChannelSectionId) => void;
}

export const ChannelSectionNav = ({
  items,
  activeId,
  onSelect,
}: ChannelSectionNavProps): ReactNode => {
  const intl = useIntl();

  return (
    <Box
      as="nav"
      className={styles.nav}
      aria-label={intl.formatMessage(messages.navAriaLabel)}
      data-test-id="channel-section-nav"
    >
      <Box as="ul" className={styles.list}>
        {items.map(item => {
          const isActive = item.id === activeId;

          return (
            <Box as="li" key={item.id} className={clsx(styles.item, isActive && styles.active)}>
              <button
                type="button"
                className={styles.button}
                aria-current={isActive ? "true" : undefined}
                data-test-id={`channel-section-nav-${item.id}`}
                onClick={() => onSelect(item.id)}
              >
                <Text as="span" size={3}>
                  {item.label}
                </Text>
              </button>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export const ChannelSection = ({
  id,
  children,
}: {
  id: ChannelSectionId;
  children: ReactNode;
}): ReactNode => (
  <Box id={id} className={styles.section} data-test-id={id}>
    {children}
  </Box>
);
