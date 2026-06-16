import { Box } from "@saleor/macaw-ui-next";

import styles from "./TranslationProgressBar.module.css";
import { TranslationProgressCompletePill } from "./TranslationProgressCompletePill";

interface TranslationProgressBarProps {
  percentage: number;
}

export const TranslationProgressBar = ({ percentage }: TranslationProgressBarProps) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const isComplete = clampedPercentage === 100;

  if (isComplete) {
    return <TranslationProgressCompletePill data-test-id="translation-progress-bar" />;
  }

  return (
    <Box className={styles.translationProgressBar} data-test-id="translation-progress-bar">
      <Box
        className={styles.translationProgressBarFill}
        __width={`${clampedPercentage}%`}
        aria-hidden
      />
    </Box>
  );
};

TranslationProgressBar.displayName = "TranslationProgressBar";
