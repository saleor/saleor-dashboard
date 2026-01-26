import { Box, Text } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { messages } from "../messages";
import { GeneratedVariantPreview } from "../types";
import styles from "./VariantPreviewList.module.css";

interface VariantPreviewListProps {
  previews: GeneratedVariantPreview[];
}

export const VariantPreviewList = ({ previews }: VariantPreviewListProps) => {
  const intl = useIntl();

  const { sortedPreviews, newCount, existingCount } = useMemo(() => {
    const sorted = [...previews].sort((a, b) =>
      a.isExisting === b.isExisting ? 0 : a.isExisting ? 1 : -1,
    );

    return {
      sortedPreviews: sorted,
      newCount: previews.filter(p => !p.isExisting).length,
      existingCount: previews.filter(p => p.isExisting).length,
    };
  }, [previews]);

  const hasContent = newCount > 0 || existingCount > 0;

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
    <div className={styles.wrapper}>
      <Box className={styles.container}>
        <Box className={styles.list}>
          {sortedPreviews.map((variant, index) => (
            <Box key={`${variant.name}-${index}`} className={styles.item}>
              {variant.isExisting ? (
                <Text size={2} color="default2" className={styles.badge}>
                  {intl.formatMessage(messages.existsBadge)}
                </Text>
              ) : (
                <span className={styles.newBadge}>{intl.formatMessage(messages.newBadge)}</span>
              )}
              <Text size={2} color={variant.isExisting ? "default2" : "default1"}>
                {variant.name}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>
    </div>
  );
};
