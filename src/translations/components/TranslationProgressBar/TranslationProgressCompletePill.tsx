import { getStatusColor } from "@dashboard/misc";
import { Box, useTheme } from "@saleor/macaw-ui-next";
import { Check } from "lucide-react";
import { useIntl } from "react-intl";

import styles from "./TranslationProgressBar.module.css";

interface TranslationProgressCompletePillProps {
  "data-test-id"?: string;
}

export const TranslationProgressCompletePill = ({
  "data-test-id": dataTestId,
}: TranslationProgressCompletePillProps) => {
  const intl = useIntl();
  const { theme } = useTheme();
  const successColors = getStatusColor({ status: "success", currentTheme: theme });

  return (
    <Box
      className={styles.translationProgressCompletePill}
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="100%"
      borderStyle="solid"
      borderWidth={1}
      flexShrink="0"
      __backgroundColor={successColors.base}
      __borderColor={successColors.border}
      __color={successColors.text}
      data-test-id={dataTestId}
      aria-label={intl.formatMessage({
        id: "8CXYxE",
        defaultMessage: "All fields translated",
        description: "translation progress complete state",
      })}
    >
      <Check size={14} strokeWidth={2.5} color="currentColor" aria-hidden />
    </Box>
  );
};

TranslationProgressCompletePill.displayName = "TranslationProgressCompletePill";
