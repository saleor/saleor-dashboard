import { type TransactionItemFragment } from "@dashboard/graphql";
import { type FakeTransaction } from "@dashboard/orders/types";

type OrderTransaction = TransactionItemFragment | FakeTransaction;

export type ExtendedOrderTransaction = OrderTransaction & {
  index?: number;
};
