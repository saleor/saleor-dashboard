import Skeleton from "@saleor/components/Skeleton";
import {
  OrderDetailsFragment,
  OrderGiftCardFragment,
  TransactionEventTypeEnum,
} from "@saleor/graphql";
import { FakeTransaction, TransactionFakeEvent } from "@saleor/orders/types";
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

  const fakeEvents = usedInOrderEvents.map<TransactionFakeEvent>(event => ({
    message: intl.formatMessage(transactionGiftCardMessages.usedInOrder),
    id: event.id,
    pspReference: event.id,
    type: TransactionEventTypeEnum.CHARGE_SUCCESS,
    createdAt: event.date,
    amount: {
      amount:
        event.balance.oldCurrentBalance.amount -
        event.balance.currentBalance.amount,
      currency: event.balance.currentBalance.currency,
      __typename: "Money",
    },
    mappedResult: {
      type: "CHARGE",
      status: "SUCCESS",
    },
    createdBy: null,
    externalUrl: null,
    __typename: "TransactionFakeEvent",
  }));

  const fakeTransaction: FakeTransaction = {
    id: giftCard.id,
    type: intl.formatMessage(transactionGiftCardMessages.giftCard, {
      code: giftCard.last4CodeChars,
    }),
    actions: [],
    pspReference: giftCard.last4CodeChars,
    status: "",
    externalUrl: null,
    chargedAmount: {
      currency,
      amount,
      __typename: "Money",
    },
    refundedAmount: {
      currency,
      amount: 0,
      __typename: "Money",
    },
    authorizedAmount: {
      currency,
      amount: 0,
      __typename: "Money",
    },
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
