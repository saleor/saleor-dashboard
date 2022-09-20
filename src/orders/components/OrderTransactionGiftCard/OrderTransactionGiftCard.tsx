import Skeleton from "@saleor/components/Skeleton";
import {
  GiftCardEventsEnum,
  OrderDetailsFragment,
  OrderGiftCardFragment,
  TransactionItemFragment,
  TransactionStatus,
} from "@saleor/graphql";
import React from "react";
import { useIntl } from "react-intl";

import OrderTransaction from "../OrderTransaction";
import { transactionGiftCardMessages } from "./messages";

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

  const usedInOrderEvents = giftCard.events.filter(
    ({ orderId, type }) =>
      type === GiftCardEventsEnum.USED_IN_ORDER && orderId === order.id,
  );

  if (usedInOrderEvents.length === 0) {
    return null;
  }

  const amount = usedInOrderEvents.reduce((resultAmount, { balance }) => {
    const { currentBalance, oldCurrentBalance } = balance;

    const amountToAdd = oldCurrentBalance.amount - currentBalance.amount;

    return resultAmount + amountToAdd;
  }, 0);

  const currency = usedInOrderEvents[0].balance.currentBalance.currency;

  const fakeTransaction = {
    id: giftCard.id,
    type: intl.formatMessage(transactionGiftCardMessages.giftCard, {
      code: giftCard.last4CodeChars,
    }),
    events: usedInOrderEvents.map(event => ({
      name: intl.formatMessage(transactionGiftCardMessages.usedInOrder),
      id: event.id,
      status: TransactionStatus.SUCCESS,
      createdAt: event.date,
    })),
    actions: [],
    reference: giftCard.last4CodeChars,
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
