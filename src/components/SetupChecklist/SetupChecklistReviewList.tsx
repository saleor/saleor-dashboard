import { Box, Text } from "@saleor/macaw-ui-next";
import { ChevronRight } from "lucide-react";

import styles from "./SetupChecklist.module.css";
import { type SetupChecklistReviewItem, type SetupChecklistSectionHeader } from "./types";

interface SetupChecklistReviewListProps extends Partial<SetupChecklistSectionHeader> {
  items: SetupChecklistReviewItem[];
  "data-test-id"?: string;
}

export const SetupChecklistReviewList = ({
  title,
  subtitle,
  items,
  "data-test-id": dataTestId = "setup-checklist-review",
}: SetupChecklistReviewListProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <Box className={styles.reviewSection} data-test-id={dataTestId}>
      {title ? (
        <Box className={styles.sectionHeader}>
          <Text as="h3" className={styles.sectionTitle}>
            {title}
          </Text>
          {subtitle ? (
            <Text size={2} color="default2">
              {subtitle}
            </Text>
          ) : null}
        </Box>
      ) : null}
      <Box as="ul" className={styles.reviewList}>
        {items.map(item => (
          <Box as="li" key={item.id}>
            <button
              type="button"
              className={styles.reviewItem}
              onClick={item.onClick}
              disabled={item.disabled}
              data-test-id={`${dataTestId}-${item.id}`}
            >
              <Box className={styles.reviewLeading} aria-hidden>
                <Box
                  className={
                    item.iconVariant === "accent"
                      ? `${styles.reviewIcon} ${styles.reviewIconAccent}`
                      : styles.reviewIcon
                  }
                >
                  {item.icon}
                </Box>
              </Box>
              <Box className={styles.reviewContent}>
                <Text size={3} fontWeight="medium">
                  {item.title}
                </Text>
                <Text size={2} color="default2">
                  {item.description}
                </Text>
              </Box>
              <Box className={styles.reviewStatus}>
                {item.status != null && (
                  <>
                    <Box className={styles.reviewStatusDot} aria-hidden />
                    <Text size={2} color="default2" className={styles.reviewStatusLabel}>
                      {item.status}
                    </Text>
                  </>
                )}
                <Box className={styles.reviewChevron} aria-hidden>
                  <ChevronRight size={16} strokeWidth={1.75} />
                </Box>
              </Box>
            </button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
