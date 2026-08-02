import {
  AllocationStrategyEnum,
  CountryCode,
  MarkAsPaidStrategyEnum,
  TransactionFlowStrategyEnum,
} from "@dashboard/graphql";

import { buildChannelCreateInput } from "./buildChannelCreateInput";

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
});
