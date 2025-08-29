import { UrlEntry, UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

import { InitialOrderStateResponse } from "./InitialOrderState";

describe("ConditionalFilter / API / Orders / InitialOrderState", () => {
  it("should filter by charge status", () => {
    // Arrange
    const initialOrderState = InitialOrderStateResponse.empty();

    initialOrderState.chargeStatus = [
      {
        label: "Fully Charged",
        value: "FULLY_CHARGED",
        slug: "FULLY_CHARGED",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.chargeStatus", "FULLY_CHARGED"));
    const expectedOutput = [
      {
        label: "Fully Charged",
        value: "FULLY_CHARGED",
        slug: "FULLY_CHARGED",
      },
    ];

    // Act
    const result = initialOrderState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should filter by click and collect", () => {
    // Arrange
    const initialOrderState = InitialOrderStateResponse.empty();

    initialOrderState.isClickAndCollect = [
      {
        label: "No",
        slug: "false",
        value: "false",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.isClickAndCollect", "false"));
    const expectedOutput = [
      {
        label: "No",
        slug: "false",
        value: "false",
      },
    ];

    // Act
    const result = initialOrderState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should filter by created date", () => {
    const initialOrderState = InitialOrderStateResponse.empty();

    const token = UrlToken.fromUrlEntry(new UrlEntry("s4.createdAt", "2024-06-04T11%3A22"));
    const result = initialOrderState.filterByUrlToken(token);

    // For date fields, filterByUrlToken returns the raw token value (string)
    expect(result).toEqual("2024-06-04T11%3A22");
    expect(result).toEqual(token.value);
  });
});
