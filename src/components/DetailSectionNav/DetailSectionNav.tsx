import { Box, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type ReactNode } from "react";

import styles from "./DetailSectionNav.module.css";

export interface DetailSectionNavItem {
  id: string;
  label: ReactNode;
}

interface DetailSectionNavProps {
  items: DetailSectionNavItem[];
  activeId?: string;
  onSelect: (sectionId: string) => void;
  ariaLabel: string;
  "data-test-id"?: string;
}

export const DetailSectionNav = ({
  items,
  activeId,
  onSelect,
  ariaLabel,
  "data-test-id": dataTestId = "detail-section-nav",
}: DetailSectionNavProps): ReactNode => (
  <Box as="nav" className={styles.nav} aria-label={ariaLabel} data-test-id={dataTestId}>
    <Box as="ul" className={styles.list}>
      {items.map(item => {
        const isActive = item.id === activeId;

        return (
          <Box as="li" key={item.id} className={clsx(styles.item, isActive && styles.active)}>
            <button
              type="button"
              className={styles.button}
              aria-current={isActive ? "true" : undefined}
              data-test-id={`${dataTestId}-${item.id}`}
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

export const DetailSection = ({ id, children }: { id: string; children: ReactNode }): ReactNode => (
  <Box id={id} className={styles.section} data-test-id={id}>
    {children}
  </Box>
);
