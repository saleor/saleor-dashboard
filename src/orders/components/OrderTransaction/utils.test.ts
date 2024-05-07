// @ts-strict-ignore
import { TransactionEventFragment } from "@dashboard/graphql";
import { TransactionFakeEvent, TransactionMappingResult } from "@dashboard/orders/types";

import { mapTransactionEvent } from "./utils";

describe("mapTransactionEvent", () => {
  it("returns object with nulls when no event is passed", () => {
    expect(mapTransactionEvent(null)).toStrictEqual({
      type: null,
      status: null,
    });
  });
  it("unpacks transaction event into status and type", () => {
    expect(
      mapTransactionEvent({
        type: "AUTHORIZATION_FAILURE",
        __typename: "TransactionEvent",
      } as TransactionEventFragment),
    ).toStrictEqual<TransactionMappingResult>({
      type: "AUTHORIZATION",
      status: "FAILED",
    });
    expect(
      mapTransactionEvent({
        type: "AUTHORIZATION_REQUEST",
        __typename: "TransactionEvent",
      } as TransactionEventFragment),
    ).toStrictEqual<TransactionMappingResult>({
      type: "AUTHORIZATION",
      status: "REQUEST",
    });
    expect(
      mapTransactionEvent({
        type: "AUTHORIZATION_SUCCESS",
        __typename: "TransactionEvent",
      } as TransactionEventFragment),
    ).toStrictEqual<TransactionMappingResult>({
      type: "AUTHORIZATION",
      status: "SUCCESS",
    });
    expect(
      mapTransactionEvent({
        type: "CHARGE_BACK",
        __typename: "TransactionEvent",
      } as TransactionEventFragment),
    ).toStrictEqual<TransactionMappingResult>({
      type: "CHARGEBACK",
      status: "INFO",
    });
    expect(
      mapTransactionEvent({
        type: "REFUND_REVERSE",
        __typename: "TransactionEvent",
      } as TransactionEventFragment),
    ).toStrictEqual<TransactionMappingResult>({
      type: "REFUND_REVERSED",
      status: "INFO",
    });
    expect(
      mapTransactionEvent({
        type: "AUTHORIZATION_ADJUSTMENT",
        __typename: "TransactionEvent",
      } as TransactionEventFragment),
    ).toStrictEqual<TransactionMappingResult>({
      type: "AUTHORIZATION_ADJUSTMENT",
      status: "INFO",
    });
  });
  it("uses mappedResult from TransactionFakeEvent", () => {
    const result = mapTransactionEvent({
      __typename: "TransactionFakeEvent",
      mappedResult: {
        type: "CHARGE",
        status: "SUCCESS",
      },
    } as TransactionFakeEvent);

    expect(result).toStrictEqual({
      type: "CHARGE",
      status: "SUCCESS",
    });
  });
});
