import {
  TransactionEventFragment,
  TransactionItemFragment,
} from "@saleor/graphql";

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

export type TransactionFakeEvent = Omit<
  TransactionEventFragment,
  "type" | "__typename"
> & {
  __typename: "TransactionFakeEvent";
  mappedResult: TransactionMappingResult;
};

export type FakeTransaction = Omit<
  TransactionItemFragment,
  "events" | "__typename"
> & { __typename: "FakeTransaction" };
