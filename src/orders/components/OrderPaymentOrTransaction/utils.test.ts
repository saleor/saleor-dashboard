// @ts-strict-ignore
import { order as orderFixture, payments } from "@dashboard/orders/fixtures";

import { getFilteredPayments } from "./utils";

describe("getFilteredPayments", () => {
  const order = orderFixture(null);

  it("returns empty when there is no order", () => {
    expect(getFilteredPayments(null)).toStrictEqual([]);
  });
  it("returns empty when there are no payments", () => {
    expect(getFilteredPayments(order)).toStrictEqual([]);
  });
  it("returns payments that are active and have transactions attached", () => {
    expect(getFilteredPayments({ ...order, payments: [payments.authorized] })).toStrictEqual([
      payments.authorized,
    ]);
  });
});
