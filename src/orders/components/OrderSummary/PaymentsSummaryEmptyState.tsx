import { Box, Text } from "@saleor/macaw-ui-next";
import { CreditCard } from "lucide-react";
import { useIntl } from "react-intl";

export const PaymentsSummaryEmptyState = () => {
  const intl = useIntl();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      paddingX={4}
      paddingY={8}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width={14}
        height={14}
        borderRadius="100%"
        backgroundColor="default2"
        color="default2"
      >
        <CreditCard size={24} stroke="currentColor" />
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" gap={1} textAlign="center">
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
