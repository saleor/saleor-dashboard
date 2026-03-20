import { getStaticUrl } from "@dashboard/config";
import { type OtherPaymentMethodDetailsFragment } from "@dashboard/graphql";
import { Text } from "@saleor/macaw-ui-next";
import { useState } from "react";

interface OtherPaymentMethodProps {
  details: OtherPaymentMethodDetailsFragment;
}

const BRAND_LOGO_SIZE = 20;

const getPaymentMethodIconUrl = (name: string) =>
  `${getStaticUrl()}payment-methods/${name.toLowerCase()}.svg`;

const Logo = ({ name }: { name?: string }) => {
  const [hasError, setHasError] = useState(false);

  if (!name) {
    return null;
  }

  if (hasError) {
    return (
      <Text>
        <Text fontWeight="medium">Paid by:</Text> {name}
      </Text>
    );
  }

  return (
    <img
      src={getPaymentMethodIconUrl(name)}
      title={name}
      alt={name}
      height={BRAND_LOGO_SIZE}
      /**
       * We load images dynamically so:
       1. Try to render
       2. Catch loading error
       3. Set state
       4. Render placeholder
       */
      onError={() => setHasError(true)}
    />
  );
};

export const OtherPaymentMethod = ({ details }: OtherPaymentMethodProps) => (
  <Text size={2}>
    <Logo key={details.name} name={details.name} />
  </Text>
);
