import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

export const OrderCustomerNote = ({ note }: { note: string }) => {
  const intl = useIntl();

  return (
    <Box padding={6} gap={4} display="grid">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text size={5} fontWeight="medium">
          {intl.formatMessage({
            defaultMessage: "Notes",
            id: "7+Domh",
          })}
        </Text>
      </Box>
      <Text>{note}</Text>
    </Box>
  );
};
