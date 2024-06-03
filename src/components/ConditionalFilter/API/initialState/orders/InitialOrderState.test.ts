import { UrlEntry, UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

import { InitialOrderStateResponse } from "./InitialOrderState";

describe("ConditionalFilter / API / Orders / InitialOrderState", () => {
  it("should filter by payment status", () => {
    // Arrange
    const initialOrderState = InitialOrderStateResponse.empty();

    initialOrderState.paymentStatus = [
      {
        label: "Paid",
        value: "FULLY_CHARGED",
        slug: "FULLY_CHARGED",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.paymentStatus", "FULLY_CHARGED"));
    const expectedOutput = [
      {
        label: "Paid",
        value: "FULLY_CHARGED",
        slug: "FULLY_CHARGED",
      },
    ];

    // Act
    const result = initialOrderState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should filter by customer", () => {
    // Arrange
    const initialOrderState = InitialOrderStateResponse.empty();

    initialOrderState.customer = [
      {
        label: "Customer",
        slug: "customer",
        value: "test",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.customer", "test"));
    const expectedOutput = [
      {
        label: "Customer",
        slug: "customer",
        value: "test",
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
});
