import { type GiftCardAppliedFragment, type OrderDetailsFragment } from "@dashboard/graphql";
import { type FakeTransaction, type TransactionFakeEvent } from "@dashboard/orders/types";
import { prepareMoney } from "@dashboard/orders/utils/data";
import { Skeleton } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import OrderTransaction from "../OrderTransaction";
import { transactionGiftCardMessages } from "./messages";

interface OrderTransactionGiftCardProps {
  order: OrderDetailsFragment;
  application: GiftCardAppliedFragment;
}

const OrderTransactionGiftCard = ({ order, application }: OrderTransactionGiftCardProps) => {
  const intl = useIntl();

  if (!application || !order) {
    return <Skeleton />;
  }

  const fakeEvents: TransactionFakeEvent[] = [
    {
      message: intl.formatMessage(transactionGiftCardMessages.usedInOrder),
      id: application.giftCard.id,
      pspReference: application.giftCard.id,
      reasonReference: null,
      createdAt: order.created,
      amount: { ...application.amount, __typename: "Money" },
      mappedResult: {
        type: "CHARGE",
        status: "SUCCESS",
      },
      createdBy: null,
      externalUrl: "",
      __typename: "TransactionFakeEvent",
    },
  ];

  const fakeTransaction: FakeTransaction = {
    id: application.giftCard.id,
    name: intl.formatMessage(transactionGiftCardMessages.giftCard, {
      code: application.giftCard.last4CodeChars,
    }),
    actions: [],
    pspReference: application.giftCard.last4CodeChars,
    externalUrl: "",
    chargedAmount: { ...application.amount, __typename: "Money" },
    createdAt: order.created,
    authorizedAmount: prepareMoney(0, application.amount.currency),
    authorizePendingAmount: prepareMoney(0, application.amount.currency),
    chargePendingAmount: prepareMoney(0, application.amount.currency),
    refundedAmount: prepareMoney(0, application.amount.currency),
    refundPendingAmount: prepareMoney(0, application.amount.currency),
    canceledAmount: prepareMoney(0, application.amount.currency),
    cancelPendingAmount: prepareMoney(0, application.amount.currency),
    createdBy: null,
    paymentMethodDetails: null,
    __typename: "FakeTransaction",
  };

  return (
    <OrderTransaction
      transaction={fakeTransaction}
      fakeEvents={fakeEvents}
      onTransactionAction={() => undefined}
    />
  );
};

export default OrderTransactionGiftCard;
