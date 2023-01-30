import {
  OrderDetailsFragment,
  OrderDetailsQuery,
  OrderRefundDataQuery,
} from "@dashboard/graphql";
import {
  OrderDetailsWithTransactionsFragment,
  OrderDetailsWithTransactionsQuery,
  TransactionEventFragment,
  TransactionItemFragment,
} from "@dashboard/graphql/transactions";

export type ShopWithTransactions = OrderDetailsWithTransactionsQuery["shop"];
export type ShopBothTypes = OrderDetailsQuery["shop"] | ShopWithTransactions;

export type OrderBothTypes =
  | OrderDetailsFragment
  | OrderDetailsWithTransactionsFragment;

/** use type from WithTransactions, exclude fields not available on old OrderDetails */
export type OrderSharedType = Pick<
  OrderDetailsWithTransactionsFragment,
  keyof OrderDetailsFragment & keyof OrderDetailsWithTransactionsFragment
>;

export const isOrderWithTransactions = (
  _order: any,
  featureFlag: boolean,
): _order is OrderDetailsWithTransactionsFragment => featureFlag;

export type OrderRefundData = OrderRefundDataQuery["order"];
export type OrderRefundSharedType = Pick<
  OrderRefundData,
  keyof OrderDetailsFragment &
    keyof OrderDetailsWithTransactionsFragment &
    keyof OrderRefundData
>;

/** Type of the trasaction event (e.g. CHARGE_SUCCESS -> CHARGE) */
export type TransactionEventType =
  | "REFUND"
  | "CHARGE"
  | "AUTHORIZATION"
  | "CANCEL"
  | "CHARGEBACK"
  | "AUTHORIZATION_ADJUSTMENT"
  | "REFUND_REVERSED";

/** Status of the transaction (e.g. CHARGE_SUCCESS -> SUCCESS) */
export type TransactionEventStatus =
  | "SUCCESS"
  | "FAILED"
  | "PENDING"
  | "REQUEST"
  | null;

export interface TransactionMappingResult {
  type: TransactionEventType;
  status: TransactionEventStatus;
}

/** Some mapped transactions don't have a 1:1 mapping to TransactionEvent.type, we want to have manuall override */
export type TransactionFakeEvent = Omit<
  TransactionEventFragment,
  "type" | "__typename"
> & {
  __typename: "TransactionFakeEvent";
  mappedResult: TransactionMappingResult;
};

/** Fake events should be passed separately into the component */
export type FakeTransaction = Omit<
  TransactionItemFragment,
  "events" | "__typename"
> & { __typename: "FakeTransaction" };
