import { getStaticUrl } from "@dashboard/config";
import { type GiftCardPaymentMethodDetailsFragment } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Gift } from "lucide-react";
import { FormattedMessage } from "react-intl";

import icon from "./saleor-gift-card.svg";

const MASKED_GROUP = "****";
const BRAND_LOGO_SIZE = 26;

const getPaymentMethodIconUrl = (fileName: string) =>
  `${getStaticUrl()}payment-methods/${fileName}.svg`;

const SaleorGiftCardIcon = () => (
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

const ExternalGiftCardIcon = ({ brand }: { brand: string | null }) => {
  if (brand) {
    return (
      <img
        src={getPaymentMethodIconUrl("gift-card")}
        alt={brand}
        title={brand}
        height={BRAND_LOGO_SIZE}
      />
    );
  }

  return <Gift size={16} />;
};

const formatGiftCardCode = (lastChars: string | null): string | null => {
  if (!lastChars) {
    return null;
  }

  return `${MASKED_GROUP} ${lastChars}`;
};

interface GiftCardPaymentMethodProps {
  details: GiftCardPaymentMethodDetailsFragment;
}

export const GiftCardPaymentMethod = ({ details }: GiftCardPaymentMethodProps) => {
  const formattedCode = formatGiftCardCode(details.lastChars);

  if (details.isSaleorGiftcard) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <SaleorGiftCardIcon />
        <Text size={2} color="default2">
          Saleor Gift Card
        </Text>
        {formattedCode && (
          <Text size={2} color="default2">
            <code>{formattedCode}</code>
          </Text>
        )}
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <ExternalGiftCardIcon brand={details.brand} />
      <Text size={2} color="default2">
        {details.brand ?? <FormattedMessage defaultMessage="Gift card" id="4X0ZI8" />}
      </Text>
      {formattedCode && (
        <Text size={2} color="default2">
          <code>{formattedCode}</code>
        </Text>
      )}
    </Box>
  );
};
