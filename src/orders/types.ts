import {
  MarkAsPaidStrategyEnum,
  OrderDetailsFragment,
  OrderDraftListQuery,
  OrderRefundDataQuery,
  TransactionEventFragment,
  TransactionItemFragment,
} from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

/** Check if order has transactions & feature flag enabled */
export const orderHasTransactions = (order: OrderDetailsFragment): boolean =>
  order?.transactions?.length > 0;

export const orderHasPayments = (order: OrderDetailsFragment): boolean =>
  order?.payments?.length > 0;

export const orderShouldUseTransactions = (order: OrderDetailsFragment): boolean => {
  if (orderHasTransactions(order)) {
    return true;
  }

  if (orderHasPayments(order)) {
    return false;
  }

  return (
    order?.channel?.orderSettings?.markAsPaidStrategy === MarkAsPaidStrategyEnum.TRANSACTION_FLOW
  );
};

export type OrderRefundData = OrderRefundDataQuery["order"];
export type OrderRefundSharedType = Pick<
  OrderRefundData,
  keyof OrderDetailsFragment & keyof OrderDetailsFragment & keyof OrderRefundData
>;

export type OrderDraft = RelayToFlat<NonNullable<OrderDraftListQuery["draftOrders"]>>[number];

/** Type of the trasaction event (e.g. CHARGE_SUCCESS -> CHARGE) */
export type TransactionEventType =
  | "REFUND"
  | "CHARGE"
  | "AUTHORIZATION"
  | "CANCEL"
  | "CHARGEBACK"
  | "AUTHORIZATION_ADJUSTMENT"
  | "REFUND_REVERSED"
  | "INFO";

/** Status of the transaction (e.g. CHARGE_SUCCESS -> SUCCESS) */
export type TransactionEventStatus = "SUCCESS" | "FAILED" | "PENDING" | "REQUEST" | "INFO" | null;

export interface TransactionMappingResult {
  type: TransactionEventType;
  status: TransactionEventStatus;
}

/** Some mapped transactions don't have a 1:1 mapping to TransactionEvent.type, we want to have manuall override */
export type TransactionFakeEvent = Omit<TransactionEventFragment, "type" | "__typename"> & {
  __typename: "TransactionFakeEvent";
  mappedResult: TransactionMappingResult;
};

/** Fake events should be passed separately into the component */
export type FakeTransaction = Omit<TransactionItemFragment, "events" | "__typename"> & {
  __typename: "FakeTransaction";
};
