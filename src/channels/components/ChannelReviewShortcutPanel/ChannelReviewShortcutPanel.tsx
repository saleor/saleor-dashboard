import { type SetupChecklistReviewItem } from "@dashboard/components/SetupChecklist/types";
import { Box, Text } from "@saleor/macaw-ui-next";
import { ChevronRight } from "lucide-react";

import styles from "./ChannelReviewShortcutPanel.module.css";

interface ChannelReviewShortcutPanelProps {
  item: SetupChecklistReviewItem;
  "data-test-id"?: string;
}

export const ChannelReviewShortcutPanel = ({
  item,
  "data-test-id": dataTestId,
}: ChannelReviewShortcutPanelProps) => (
  <Box className={styles.panel} data-test-id={dataTestId}>
    <button
      type="button"
      className={styles.item}
      onClick={item.onClick}
      disabled={item.disabled}
      data-test-id={dataTestId ? `${dataTestId}-action` : undefined}
    >
      <Box className={styles.leading} aria-hidden>
        <Box className={styles.icon}>{item.icon}</Box>
      </Box>
      <Box className={styles.content}>
        <Text size={3} fontWeight="medium">
          {item.title}
        </Text>
        <Text size={2} color="default2">
          {item.description}
        </Text>
      </Box>
      <Box className={styles.status}>
        {item.status != null && (
          <>
            <Box className={styles.statusDot} aria-hidden />
            <Text size={2} color="default2">
              {item.status}
            </Text>
          </>
        )}
        <Box className={styles.chevron} aria-hidden>
          <ChevronRight size={16} strokeWidth={1.75} />
        </Box>
      </Box>
    </button>
  </Box>
);
