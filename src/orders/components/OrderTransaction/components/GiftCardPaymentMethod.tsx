import { type SaleorGiftcardPaymentMethodDetailsFragment } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";

import icon from "./saleor-gift-card.svg";

const MASKED_GROUP = "****-****-";

const GiftCardIcon = () => (
  <Box
    width={6}
    height={4}
    borderRadius={2}
    borderStyle="solid"
    borderWidth={1}
    borderColor="default1"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    <img src={icon} alt="Saleor Gift Card" title="Saleor Gift Card" />
  </Box>
);

interface GiftCardPaymentMethodProps {
  details: SaleorGiftcardPaymentMethodDetailsFragment;
}

export const GiftCardPaymentMethod = ({ details }: GiftCardPaymentMethodProps) => {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      <GiftCardIcon />
      <Text size={2} color="default2">
        <code>
          {MASKED_GROUP}
          {details.code}
        </code>
      </Text>
    </Box>
  );
};
