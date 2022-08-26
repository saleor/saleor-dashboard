import { TransactionStatus } from "@saleor/graphql";
import OrderTransaction, {
  OrderTransactionProps,
} from "@saleor/orders/components/OrderTransaction";
import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../Decorator";

const props: OrderTransactionProps = {
  transaction: {
    __typename: "TransactionItem",
    id: "VHJhbnNhY3Rpb25JdGVtOjI=",
    type: "Adyen: refund",
    reference: "12345",
    events: [
      {
        id: "VHJhbnNhY3Rpb25FdmVudDoy",
        reference: "SDFDS34543SDDFS",
        createdAt: "2022-08-12T15:14:27.119138+00:00",
        status: TransactionStatus.SUCCESS,
        name: "123",
        __typename: "TransactionEvent",
      },
    ],
    authorizedAmount: {
      amount: 1.21,
      currency: "USD",
      __typename: "Money",
    },
    refundedAmount: {
      amount: 34.21,
      currency: "USD",
      __typename: "Money",
    },
    chargedAmount: {
      amount: 0,
      currency: "USD",
      __typename: "Money",
    },
  },
};

storiesOf("Orders / OrderTransaction", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderTransaction {...props} />);
