import mastercardLogo from "@assets/images/payment-methods/mastercard.svg";
import visaLogo from "@assets/images/payment-methods/visa.svg";
import { CardPaymentMethodDetailsFragment } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { CreditCard } from "lucide-react";

const MASKED_GROUP = "****";
const BRAND_LOGO_SIZE = 35;

const brandLogos: Record<string, string> = {
  visa: visaLogo,
  mastercard: mastercardLogo,
  mc: mastercardLogo,
};

const BrandLogo = ({ brand }: { brand: string }) => {
  const logo = brandLogos[brand.toLowerCase()];

  if (logo) {
    return <img src={logo} alt={brand} title={brand} height={BRAND_LOGO_SIZE} />;
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
