import { TaxCalculationStrategy } from "@dashboard/graphql";

import { getTaxStatusMessage } from "./getTaxStatusMessage";
import { messages } from "./messages";

describe("getTaxStatusMessage", () => {
  it("returns taxes off when chargeTaxes is false", () => {
    // Arrange & Act
    const result = getTaxStatusMessage({
      chargeTaxes: false,
      taxCalculationStrategy: TaxCalculationStrategy.FLAT_RATES,
    });

    // Assert
    expect(result).toBe(messages.taxStatusOff);
  });

  it("returns flat rates for FLAT_RATES strategy", () => {
    // Arrange & Act
    const result = getTaxStatusMessage({
      chargeTaxes: true,
      taxCalculationStrategy: TaxCalculationStrategy.FLAT_RATES,
    });

    // Assert
    expect(result).toBe(messages.taxStatusFlatRates);
  });

  it("returns tax app for TAX_APP strategy", () => {
    // Arrange & Act
    const result = getTaxStatusMessage({
      chargeTaxes: true,
      taxCalculationStrategy: TaxCalculationStrategy.TAX_APP,
    });

    // Assert
    expect(result).toBe(messages.taxStatusApp);
  });
});
