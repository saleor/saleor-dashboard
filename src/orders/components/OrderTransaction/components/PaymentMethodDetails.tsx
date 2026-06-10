import { type TransactionItemFragment } from "@dashboard/graphql";
import { errorTracker } from "@dashboard/services/errorTracking";
import { Text } from "@saleor/macaw-ui-next";

import { CardPaymentMethod } from "./CardPaymentMethod";
import { GiftCardPaymentMethod } from "./GiftCardPaymentMethod";
import { OtherPaymentMethod } from "./OtherPaymentMethod";

type PaymentMethodDetailsType = TransactionItemFragment["paymentMethodDetails"];

interface PaymentMethodDetailsProps {
  paymentMethodDetails: PaymentMethodDetailsType | undefined;
}

export const PaymentMethodDetails = ({ paymentMethodDetails }: PaymentMethodDetailsProps) => {
  if (!paymentMethodDetails) {
    return null;
  }

  switch (paymentMethodDetails.__typename) {
    case "CardPaymentMethodDetails":
      return <CardPaymentMethod details={paymentMethodDetails} />;
    case "GiftCardPaymentMethodDetails":
      return <GiftCardPaymentMethod details={paymentMethodDetails} />;
    case "OtherPaymentMethodDetails":
      return <OtherPaymentMethod details={paymentMethodDetails} />;
    default: {
      const unknown = paymentMethodDetails as { __typename: string; name?: string };

      errorTracker.captureException(
        new Error(`Unknown payment method details type: ${unknown.__typename}`),
      );

      return (
        <Text size={2} color="default2">
          {unknown.name ?? "Unknown payment method"}
        </Text>
      );
    }
  }
};
