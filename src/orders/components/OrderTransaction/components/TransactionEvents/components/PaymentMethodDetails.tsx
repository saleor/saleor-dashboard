import { TransactionItemFragment } from "@dashboard/graphql";

import { CardPaymentMethod } from "../../CardPaymentMethod";
import { OtherPaymentMethod } from "../../OtherPaymentMethod";

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
    case "OtherPaymentMethodDetails":
      return <OtherPaymentMethod details={paymentMethodDetails} />;
  }
};
