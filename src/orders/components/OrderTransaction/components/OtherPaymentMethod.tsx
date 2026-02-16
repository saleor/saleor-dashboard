import { getAppMountUri } from "@dashboard/config";
import { OtherPaymentMethodDetailsFragment } from "@dashboard/graphql";
import { Text } from "@saleor/macaw-ui-next";
import { useState } from "react";

interface OtherPaymentMethodProps {
  details: OtherPaymentMethodDetailsFragment;
}

const BRAND_LOGO_SIZE = 20;

const getPaymentMethodIconUrl = (name: string) =>
  `${getAppMountUri()}payment-methods/${name.toLowerCase()}.svg`;

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
      onError={() => setHasError(true)}
    />
  );
};

export const OtherPaymentMethod = ({ details }: OtherPaymentMethodProps) => (
  <Text size={2}>
    <Logo name={details.name} />
  </Text>
);
