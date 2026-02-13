import { OtherPaymentMethodDetailsFragment } from "@dashboard/graphql";
import { Text } from "@saleor/macaw-ui-next";

interface OtherPaymentMethodProps {
  details: OtherPaymentMethodDetailsFragment;
}

export const OtherPaymentMethod = ({ details }: OtherPaymentMethodProps) => (
  <Text size={2}>{details.name}</Text>
);
