import {
  order,
  orderWithTransactions,
  payments,
} from "@dashboard/orders/fixtures";

import { getFilteredPayments } from "./utils";

describe("getFilteredTransactions", () => {
  it("returns empty when there is no order", () => {
    expect(getFilteredPayments(null)).toStrictEqual([]);
  });

  it("returns empty when there are no payments", () => {
    expect(
      getFilteredPayments({ ...orderWithTransactions, payments: [] }),
    ).toStrictEqual([]);
  });

  it("returns payments that are active and have transactions attached", () => {
    expect(
      // @ts-expect-error types mistmatch in generated types
      getFilteredPayments({ ...order, payments: [payments.authorized] }),
    ).toStrictEqual([payments.authorized]);
  });
});
