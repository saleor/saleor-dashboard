import { getAppMountUri } from "@dashboard/config";
import { CardPaymentMethodDetailsFragment } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { CreditCard } from "lucide-react";

const MASKED_GROUP = "****";
const BRAND_LOGO_SIZE = 26;

const getPaymentMethodIconUrl = (fileName: string) =>
  `${getAppMountUri()}static/payment-methods/${fileName}.svg`;

// Whitelist of card brands mapped to their icon file names
// in the activemerchant/payment_icons repository
const CARD_BRAND_ICONS: Record<string, string> = {
  visa: "visa",
  mastercard: "master",
  mc: "master",
  american_express: "american_express",
  amex: "american_express",
  discover: "discover",
  jcb: "jcb",
  diners_club: "diners_club",
  unionpay: "unionpay",
  maestro: "maestro",
  givex: "gift-card",
};

const BrandLogo = ({ brand }: { brand: string }) => {
  const iconName = CARD_BRAND_ICONS[brand.toLowerCase()];

  if (iconName) {
    return (
      <img
        src={getPaymentMethodIconUrl(iconName)}
        alt={brand}
        title={brand}
        height={BRAND_LOGO_SIZE}
      />
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <CreditCard size={16} />
      <Text size={2}>{brand}</Text>
    </Box>
  );
};

const formatCardNumber = (firstDigits: string | null, lastDigits: string | null): string | null => {
  if (firstDigits && lastDigits) {
    return `${firstDigits} ${MASKED_GROUP} ${MASKED_GROUP} ${lastDigits}`;
  }

  if (firstDigits) {
    return `${firstDigits} ${MASKED_GROUP} ${MASKED_GROUP} ${MASKED_GROUP}`;
  }

  if (lastDigits) {
    return `${MASKED_GROUP} ${MASKED_GROUP} ${MASKED_GROUP} ${lastDigits}`;
  }

  return null;
};

interface CardPaymentMethodProps {
  details: CardPaymentMethodDetailsFragment;
}

export const CardPaymentMethod = ({ details }: CardPaymentMethodProps) => {
  const cardNumber = formatCardNumber(details.firstDigits, details.lastDigits);

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {details.brand && <BrandLogo brand={details.brand} />}
      <Text size={2}>
        {cardNumber}
        {details.expMonth && details.expYear && ` (${details.expMonth}/${details.expYear})`}
      </Text>
    </Box>
  );
};
