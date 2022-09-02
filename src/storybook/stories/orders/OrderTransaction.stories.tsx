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
        reference: "",
        createdAt: "2022-08-12T17:14:27.119138+00:00",
        status: TransactionStatus.SUCCESS,
        name: "Refund",
        __typename: "TransactionEvent",
      },
      {
        id: "VHJhbnNhY3Rpb25FdmVudDoy",
        reference: "",
        createdAt: "2022-08-12T17:14:27.119138+00:00",
        status: TransactionStatus.PENDING,
        name: "Refund",
        __typename: "TransactionEvent",
      },
      {
        id: "VHJhbnNhY3Rpb25FdmVudDoy",
        reference: "SDFDS34543SDDFS",
        createdAt: "2022-08-12T15:14:27.119138+00:00",
        status: TransactionStatus.SUCCESS,
        name: "Capture",
        __typename: "TransactionEvent",
      },
      {
        id: "VHJhbnNhY3Rpb25FdmVudDoy",
        reference: "SDFDS34543SDDFS",
        createdAt: "2022-08-12T15:14:27.119138+00:00",
        status: TransactionStatus.PENDING,
        name: "Capture",
        __typename: "TransactionEvent",
      },
      {
        id: "VHJhbnNhY3Rpb25FdmVudDoy",
        reference: "SDFDS34543SDD12",
        createdAt: "2022-08-12T13:14:27.119138+00:00",
        status: TransactionStatus.FAILURE,
        name: "Capture",
        __typename: "TransactionEvent",
      },
      {
        id: "VHJhbnNhY3Rpb25FdmVudDoy",
        reference: "SDFDS34543SDD12",
        createdAt: "2022-08-12T13:14:20.119138+00:00",
        status: TransactionStatus.PENDING,
        name: "Capture",
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

const longAmountProps: OrderTransactionProps = {
  transaction: {
    ...props.transaction,
    authorizedAmount: {
      amount: 10000000000,
      currency: "VES",
      __typename: "Money",
    },
    refundedAmount: {
      amount: 10000000000,
      currency: "VES",
      __typename: "Money",
    },
    chargedAmount: {
      amount: 10000000000,
      currency: "VES",
      __typename: "Money",
    },
  },
};

storiesOf("Orders / OrderTransaction", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderTransaction {...props} />)
  .add("long amounts", () => <OrderTransaction {...longAmountProps} />);
