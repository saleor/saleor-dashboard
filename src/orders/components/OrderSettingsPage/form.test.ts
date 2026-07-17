import { MarkAsPaidStrategyEnum } from "@dashboard/graphql";

import {
  areChannelOrderSettingsEqual,
  getChannelOrderSettingsFormData,
  getDirtyChannelIds,
  getOrderSettingsFormData,
  isOrderSettingsFormPristine,
  isShopSettingsPristine,
  mergeOrderSettingsFormData,
  normalizeOrderSettingsFormData,
} from "./formData";
import { type OrderSettingsFormData } from "./types";

describe("OrderSettings form dirty helpers", () => {
  const base: OrderSettingsFormData = {
    fulfillmentAutoApprove: true,
    fulfillmentAllowUnpaid: false,
    reserveStockDurationAnonymousUser: 10,
    reserveStockDurationAuthenticatedUser: 5,
    limitQuantityPerCheckout: 50,
    channels: {
      "ch-1": {
        automaticallyConfirmAllNewOrders: true,
        automaticallyFulfillNonShippableGiftCard: true,
        allowUnpaidOrders: false,
        deleteExpiredOrdersAfter: 30,
        markAsPaidStrategy: MarkAsPaidStrategyEnum.TRANSACTION_FLOW,
      },
    },
  };

  it("treats missing shop as empty defaults", () => {
    // Arrange / Act
    const data = getOrderSettingsFormData(undefined, []);

    // Assert
    expect(data).toEqual({
      fulfillmentAutoApprove: false,
      fulfillmentAllowUnpaid: false,
      reserveStockDurationAnonymousUser: 0,
      reserveStockDurationAuthenticatedUser: 0,
      limitQuantityPerCheckout: 0,
      channels: {},
    });
  });

  it("builds channel map from query rows", () => {
    // Arrange
    const channels = [
      {
        __typename: "Channel" as const,
        id: "ch-1",
        name: "PLN",
        slug: "pln",
        currencyCode: "PLN",
        isActive: true,
        orderSettings: {
          __typename: "OrderSettings" as const,
          automaticallyConfirmAllNewOrders: false,
          automaticallyFulfillNonShippableGiftCard: true,
          allowUnpaidOrders: true,
          deleteExpiredOrdersAfter: 7,
          markAsPaidStrategy: MarkAsPaidStrategyEnum.TRANSACTION_FLOW,
        },
      },
    ];

    // Act
    const data = getOrderSettingsFormData(undefined, channels);

    // Assert
    expect(data.channels["ch-1"]).toEqual(getChannelOrderSettingsFormData(channels[0]));
  });

  it("normalizes string numbers from inputs", () => {
    // Arrange
    const dirtyLooking: OrderSettingsFormData = {
      ...base,
      reserveStockDurationAnonymousUser: "10" as unknown as number,
      limitQuantityPerCheckout: "" as unknown as number,
      channels: {
        "ch-1": {
          ...base.channels["ch-1"],
          deleteExpiredOrdersAfter: "30" as unknown as number,
        },
      },
    };

    // Act
    const normalized = normalizeOrderSettingsFormData(dirtyLooking);

    // Assert
    expect(normalized.reserveStockDurationAnonymousUser).toBe(10);
    expect(normalized.limitQuantityPerCheckout).toBe(0);
    expect(normalized.channels["ch-1"].deleteExpiredOrdersAfter).toBe(30);
  });

  it("is pristine when values match after normalization", () => {
    // Arrange
    const current: OrderSettingsFormData = {
      ...base,
      reserveStockDurationAuthenticatedUser: "5" as unknown as number,
    };

    // Act / Assert
    expect(isOrderSettingsFormPristine(current, base)).toBe(true);
  });

  it("is dirty when a shop toggle changes", () => {
    // Arrange
    const current: OrderSettingsFormData = {
      ...base,
      fulfillmentAllowUnpaid: true,
    };

    // Act / Assert
    expect(isShopSettingsPristine(current, base)).toBe(false);
    expect(isOrderSettingsFormPristine(current, base)).toBe(false);
  });

  it("is dirty when a channel field changes", () => {
    // Arrange
    const current: OrderSettingsFormData = {
      ...base,
      channels: {
        "ch-1": {
          ...base.channels["ch-1"],
          allowUnpaidOrders: true,
        },
      },
    };

    // Act / Assert
    expect(areChannelOrderSettingsEqual(current.channels["ch-1"], base.channels["ch-1"])).toBe(
      false,
    );
    expect(getDirtyChannelIds(current.channels, base.channels)).toEqual(["ch-1"]);
    expect(isOrderSettingsFormPristine(current, base)).toBe(false);
  });

  it("is dirty when a numeric shop field changes", () => {
    // Arrange
    const current: OrderSettingsFormData = {
      ...base,
      limitQuantityPerCheckout: 51,
    };

    // Act / Assert
    expect(isOrderSettingsFormPristine(current, base)).toBe(false);
  });

  it("preserves dirty channel edits when merging a partial server update", () => {
    // Arrange
    const prevData = base;
    const prevState: OrderSettingsFormData = {
      ...base,
      channels: {
        "ch-1": {
          ...base.channels["ch-1"],
          allowUnpaidOrders: true,
        },
        "ch-2": {
          automaticallyConfirmAllNewOrders: true,
          automaticallyFulfillNonShippableGiftCard: true,
          allowUnpaidOrders: false,
          deleteExpiredOrdersAfter: 10,
          markAsPaidStrategy: MarkAsPaidStrategyEnum.TRANSACTION_FLOW,
        },
      },
    };
    const serverData: OrderSettingsFormData = {
      ...base,
      channels: {
        "ch-1": base.channels["ch-1"],
        "ch-2": {
          ...prevState.channels["ch-2"],
          deleteExpiredOrdersAfter: 14,
        },
      },
    };

    // Act
    const merged = mergeOrderSettingsFormData(prevData, prevState, serverData);

    // Assert — ch-1 stayed dirty; ch-2 was pristine so took the server value
    expect(merged.channels["ch-1"].allowUnpaidOrders).toBe(true);
    expect(merged.channels["ch-2"].deleteExpiredOrdersAfter).toBe(14);
  });
});
