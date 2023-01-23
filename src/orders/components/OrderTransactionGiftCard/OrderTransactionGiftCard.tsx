import Skeleton from "@dashboard/components/Skeleton";
import {
  OrderDetailsFragment,
  OrderGiftCardFragment,
  TransactionEventStatus,
  TransactionItemFragment,
} from "@dashboard/graphql";
import React from "react";
import { useIntl } from "react-intl";

import OrderTransaction from "../OrderTransaction";
import { transactionGiftCardMessages } from "./messages";
import { getGiftCardAmount, getUsedInGiftCardEvents } from "./utils";

interface OrderTransactionGiftCardProps {
  order: OrderDetailsFragment;
  giftCard: OrderGiftCardFragment;
}

const OrderTransactionGiftCard: React.FC<OrderTransactionGiftCardProps> = ({
  order,
  giftCard,
}) => {
  const intl = useIntl();

  if (!giftCard || !order) {
    return <Skeleton />;
  }

  const usedInOrderEvents = getUsedInGiftCardEvents(giftCard, order?.id);
  const amount = getGiftCardAmount(usedInOrderEvents);

  if (usedInOrderEvents.length === 0) {
    return null;
  }

  const currency = usedInOrderEvents[0].balance.currentBalance.currency;

  const fakeTransaction = {
    id: giftCard.id,
    type: intl.formatMessage(transactionGiftCardMessages.giftCard, {
      code: giftCard.last4CodeChars,
    }),
    events: usedInOrderEvents.map(event => ({
      name: intl.formatMessage(transactionGiftCardMessages.usedInOrder),
      id: event.id,
      status: TransactionEventStatus.SUCCESS,
      createdAt: event.date,
    })),
    actions: [],
    pspReference: giftCard.last4CodeChars,
    chargedAmount: {
      currency,
      amount,
    },
    refundedAmount: {
      currency,
      amount: 0,
    },
    authorizedAmount: {
      currency,
      amount: 0,
    },
    __typename: "TransactionItem",
  } as TransactionItemFragment;

  return (
    <OrderTransaction
      transaction={fakeTransaction}
      onTransactionAction={() => undefined}
    />
  );
};

export default OrderTransactionGiftCard;
