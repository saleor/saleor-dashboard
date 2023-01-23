import { order, prepareMoney } from "@dashboard/orders/fixtures";

import { getShouldDisplayAmounts } from "./utils";

describe("PaymentSummary / getShouldDisplayAmounts", () => {
  it("hides everything when no order is passed", () => {
    expect(getShouldDisplayAmounts(undefined)).toStrictEqual(
      expect.objectContaining({
        authorized: false,
        captured: false,
        cancelled: false,
        pending: false,
      }),
    );
  });

  it("displays everything, but authorized if there's a pending value", () => {
    expect(
      getShouldDisplayAmounts({
        ...order(null),
        totalAuthorized: prepareMoney(0),
        totalAuthorizePending: prepareMoney(0),
        totalCaptured: prepareMoney(1),
        totalChargePending: prepareMoney(1),
      }),
    ).toStrictEqual(
      expect.objectContaining({
        authorized: false,
        captured: true,
        cancelled: true,
        pending: true,
      }),
    );
  });

  it("displays everything with authorized if there's a pending value", () => {
    const result1 = getShouldDisplayAmounts({
      ...order(null),
      totalAuthorized: prepareMoney(12),
      totalAuthorizePending: prepareMoney(0),
      totalChargePending: prepareMoney(1),
    });

    const result2 = getShouldDisplayAmounts({
      ...order(null),
      totalAuthorized: prepareMoney(12),
      totalAuthorizePending: prepareMoney(12),
    });

    const expectedResult = {
      authorized: true,
      captured: true,
      cancelled: true,
      pending: true,
    };

    expect(result1).toStrictEqual(expect.objectContaining(expectedResult));
    expect(result2).toStrictEqual(expect.objectContaining(expectedResult));
  });

  it("displays capture and authorize amount when they are different", () => {
    expect(
      getShouldDisplayAmounts({
        ...order(null),
        totalAuthorized: prepareMoney(10),
        totalCaptured: prepareMoney(12),
      }),
    ).toStrictEqual(
      expect.objectContaining({
        authorized: true,
        captured: true,
        cancelled: false,
        pending: false,
      }),
    );
  });

  it("displays capoture amount when it's not equal to total amount", () => {
    expect(
      getShouldDisplayAmounts({
        ...order(null),
        totalAuthorized: prepareMoney(0),
        totalCaptured: prepareMoney(12),
        total: {
          gross: prepareMoney(13),
          net: prepareMoney(13),
          tax: prepareMoney(0),
          __typename: "TaxedMoney",
        },
      }),
    ).toStrictEqual(
      expect.objectContaining({
        authorized: false,
        captured: true,
        cancelled: false,
        pending: false,
      }),
    );
  });

  it("displays authorized if there is authorized amount", () => {
    expect(
      getShouldDisplayAmounts({
        ...order(null),
        totalAuthorized: prepareMoney(10),
        totalCaptured: prepareMoney(0),
      }),
    ).toStrictEqual(
      expect.objectContaining({
        authorized: true,
        captured: false,
        cancelled: false,
        pending: false,
      }),
    );
  });

  it.skip("displays cancelled if there is cancelled amount", () => undefined);

  it("hides everything if order is fully settled", () => {
    expect(
      getShouldDisplayAmounts({
        ...order(null),
        totalCaptured: prepareMoney(1),
        total: {
          tax: prepareMoney(0),
          net: prepareMoney(1),
          gross: prepareMoney(1),
          __typename: "TaxedMoney",
        },
        totalAuthorized: prepareMoney(0),
        totalChargePending: prepareMoney(0),
        totalAuthorizePending: prepareMoney(0),
        totalCancelPending: prepareMoney(0),
      }),
    ).toStrictEqual(
      expect.objectContaining({
        authorized: false,
        captured: false,
        cancelled: false,
        pending: false,
      }),
    );
  });
});
