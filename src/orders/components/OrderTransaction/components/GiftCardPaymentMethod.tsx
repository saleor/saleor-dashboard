import { type GiftCardPaymentMethodDetailsFragment } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Gift } from "lucide-react";
import { FormattedMessage } from "react-intl";

interface GiftCardPaymentMethodProps {
  details: GiftCardPaymentMethodDetailsFragment;
}

export const GiftCardPaymentMethod = ({ details }: GiftCardPaymentMethodProps) => (
  <Box display="flex" alignItems="center" gap={2}>
    <Gift size={16} />
    <Text size={2}>
      <Text size={2} fontWeight="medium">
        <FormattedMessage defaultMessage="Gift card" id="4X0ZI8" />
      </Text>
      {details.lastChars ? ` (ending: ${details.lastChars})` : ""}
    </Text>
  </Box>
);
