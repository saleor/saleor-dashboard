import { channel } from "@dashboard/channels/fixtures";
import {
  AllocationStrategyEnum,
  CountryCode,
  MarkAsPaidStrategyEnum,
  TransactionFlowStrategyEnum,
} from "@dashboard/graphql";

import { buildChannelCreateInput } from "./buildChannelCreateInput";
import { buildChannelDuplicateSource } from "./channelDuplicate";

describe("buildChannelCreateInput", () => {
  it("maps basic form fields and applies create defaults", () => {
    // Arrange / Act
    const input = buildChannelCreateInput({
      name: " Europe ",
      slug: " europe ",
      currencyCode: "eur",
      defaultCountry: CountryCode.DE,
    });

    // Assert
    expect(input.name).toBe("Europe");
    expect(input.slug).toBe("europe");
    expect(input.currencyCode).toBe("EUR");
    expect(input.defaultCountry).toBe("DE");
    expect(input.isActive).toBeUndefined();
    expect(input.addWarehouses).toEqual([]);
    expect(input.addShippingZones).toEqual([]);
    expect(input.stockSettings?.allocationStrategy).toBe(
      AllocationStrategyEnum.PRIORITIZE_SORTING_ORDER,
    );
    expect(input.orderSettings?.markAsPaidStrategy).toBe(MarkAsPaidStrategyEnum.TRANSACTION_FLOW);
    expect(input.paymentSettings?.defaultTransactionFlowStrategy).toBe(
      TransactionFlowStrategyEnum.CHARGE,
    );
    expect(input.orderSettings?.automaticallyConfirmAllNewOrders).toBe(true);
  });

  it("slugifies the name when slug is empty", () => {
    // Arrange / Act
    const input = buildChannelCreateInput({
      name: "North America",
      slug: "",
      currencyCode: "USD",
      defaultCountry: CountryCode.US,
    });

    // Assert
    expect(input.slug).toBe("north-america");
  });

  it("copies settings and assignments from a duplicate source", () => {
    // Arrange
    const duplicateFrom = buildChannelDuplicateSource(channel, ["SZ1"]);

    // Act
    const input = buildChannelCreateInput(
      {
        name: "Copy of Test",
        slug: "test-copy",
        currencyCode: "PLN",
        defaultCountry: CountryCode.PL,
      },
      { duplicateFrom },
    );

    // Assert
    expect(input.isActive).toBe(false);
    expect(input.addWarehouses).toEqual(["WH1", "WH2"]);
    expect(input.addShippingZones).toEqual(["SZ1"]);
    expect(input.stockSettings?.allocationStrategy).toBe(
      AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    );
    expect(input.orderSettings?.allowUnpaidOrders).toBe(false);
    expect(input.paymentSettings?.defaultTransactionFlowStrategy).toBe(
      TransactionFlowStrategyEnum.CHARGE,
    );
    expect(input.checkoutSettings?.allowLegacyGiftCardUse).toBe(true);
    expect(input.checkoutSettings?.automaticCompletion).toEqual({
      enabled: true,
      delay: 30,
      cutOffDate: "2024-01-01T00:00:00Z",
    });
  });
});
