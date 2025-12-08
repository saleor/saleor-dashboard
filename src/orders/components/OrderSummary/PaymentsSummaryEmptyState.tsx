import { Box, Text } from "@saleor/macaw-ui-next";
import { CreditCard } from "lucide-react";
import { useIntl } from "react-intl";

import styles from "./PaymentsSummaryEmptyState.module.css";

export const PaymentsSummaryEmptyState = () => {
  const intl = useIntl();

  return (
    <Box className={styles.emptyState}>
      <Box className={styles.iconWrapper} color="default2">
        <CreditCard size={24} stroke="currentColor" />
      </Box>
      <Box className={styles.textContainer}>
        <Text fontWeight="medium" size={4}>
          {intl.formatMessage({
            defaultMessage: "No payment received",
            id: "6Jgwpc",
          })}
        </Text>
        <Text color="default2" size={2}>
          {intl.formatMessage({
            defaultMessage: "Mark as paid manually if the payment is confirmed",
            id: "3Eyq0y",
          })}
        </Text>
      </Box>
    </Box>
  );
};
