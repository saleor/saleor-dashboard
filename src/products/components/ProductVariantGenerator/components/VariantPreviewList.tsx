import { Box, Text } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { messages } from "../messages";
import { GeneratedVariantPreview } from "../types";
import styles from "./VariantPreviewList.module.css";

interface VariantPreviewListProps {
  previews: GeneratedVariantPreview[];
  newCount: number;
  existingCount: number;
}

export const VariantPreviewList = ({
  previews,
  newCount,
  existingCount,
}: VariantPreviewListProps) => {
  const intl = useIntl();

  const hasContent = newCount > 0 || existingCount > 0;

  const sortedPreviews = useMemo(
    () => [...previews].sort((a, b) => (a.isExisting === b.isExisting ? 0 : a.isExisting ? 1 : -1)),
    [previews],
  );

  if (!hasContent) {
    return (
      <Box className={styles.emptyState}>
        <Text size={2} color="default2">
          {intl.formatMessage(messages.selectPrompt)}
        </Text>
      </Box>
    );
  }

  // All selected combinations already exist
  if (newCount === 0 && existingCount > 0) {
    return (
      <Box className={styles.emptyState}>
        <Text size={2} color="default2">
          {intl.formatMessage(messages.allAlreadyExist)}
        </Text>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.list}>
        {sortedPreviews.map((variant, index) => (
          <Box key={index} className={styles.item}>
            {variant.isExisting ? (
              <Text size={2} color="default2" className={styles.badge}>
                Exists
              </Text>
            ) : (
              <span className={styles.newBadge}>New</span>
            )}
            <Text size={2} color={variant.isExisting ? "default2" : "default1"}>
              {variant.name}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
