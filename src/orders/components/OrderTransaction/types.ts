import { TransactionItemFragment } from "@dashboard/graphql";
import { FakeTransaction } from "@dashboard/orders/types";

type OrderTransaction = TransactionItemFragment | FakeTransaction;

export type ExtendedOrderTransaction = OrderTransaction & {
  index?: number;
};
