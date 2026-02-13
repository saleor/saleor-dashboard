import { CardPaymentMethodDetailsFragment } from "@dashboard/graphql";
import { Text } from "@saleor/macaw-ui-next";

interface CardPaymentMethodProps {
  details: CardPaymentMethodDetailsFragment;
}

export const CardPaymentMethod = ({ details }: CardPaymentMethodProps) => (
  <Text size={2}>
    {details.brand && `${details.brand} `}
    {details.firstDigits && `${details.firstDigits}...`}
    {details.lastDigits && details.lastDigits}
    {details.expMonth && details.expYear && ` (${details.expMonth}/${details.expYear})`}
  </Text>
);
