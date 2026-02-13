import blikLogo from "@assets/images/payment-methods/blik.svg";
import klarnaLogo from "@assets/images/payment-methods/klarna.svg";
import paypalLogo from "@assets/images/payment-methods/paypal.svg";
import stripeLinkLogo from "@assets/images/payment-methods/stripe-link.svg";
import { OtherPaymentMethodDetailsFragment } from "@dashboard/graphql";
import { Text } from "@saleor/macaw-ui-next";

interface OtherPaymentMethodProps {
  details: OtherPaymentMethodDetailsFragment;
}

const BRAND_LOGO_SIZE = 20;

const brandLogos: Record<string, string> = {
  klarna: klarnaLogo,
  paypal: paypalLogo,
  link: stripeLinkLogo,
  blik: blikLogo,
};

const Logo = ({ name }: { name?: string }) => {
  if (!name) {
    return null;
  }

  const logo = brandLogos[name.toLowerCase()];

  if (logo) {
    return <img src={logo} title={name} alt={name} height={BRAND_LOGO_SIZE} />;
  }

  return (
    <Text>
      <Text fontWeight="medium">Paid by:</Text> {name}
    </Text>
  );
};

export const OtherPaymentMethod = ({ details }: OtherPaymentMethodProps) => (
  <Text size={2}>
    <Logo name={details.name} />
  </Text>
);
