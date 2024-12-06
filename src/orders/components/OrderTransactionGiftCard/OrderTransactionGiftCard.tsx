// @ts-strict-ignore

import {
  OrderDetailsFragment,
  OrderGiftCardFragment,
  TransactionEventTypeEnum,
} from "@dashboard/graphql";
import { FakeTransaction, TransactionFakeEvent } from "@dashboard/orders/types";
import { prepareMoney } from "@dashboard/orders/utils/data";
import { Skeleton } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import OrderTransaction from "../OrderTransaction";
import { transactionGiftCardMessages } from "./messages";
import { getGiftCardAmount, getUsedInGiftCardEvents } from "./utils";

interface OrderTransactionGiftCardProps {
  order: OrderDetailsFragment;
  giftCard: OrderGiftCardFragment;
}

const OrderTransactionGiftCard = ({ order, giftCard }: OrderTransactionGiftCardProps) => {
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
      amount: event.balance.oldCurrentBalance.amount - event.balance.currentBalance.amount,
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
    name: intl.formatMessage(transactionGiftCardMessages.giftCard, {
      code: giftCard.last4CodeChars,
    }),
    actions: [],
    pspReference: giftCard.last4CodeChars,
    externalUrl: null,
    chargedAmount: prepareMoney(amount, currency),
    createdAt: fakeEvents[0].createdAt,
    // Fake amounts
    authorizedAmount: prepareMoney(0, currency),
    authorizePendingAmount: prepareMoney(0, currency),
    chargePendingAmount: prepareMoney(0, currency),
    refundedAmount: prepareMoney(0, currency),
    refundPendingAmount: prepareMoney(0, currency),
    canceledAmount: prepareMoney(0, currency),
    cancelPendingAmount: prepareMoney(0, currency),
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
