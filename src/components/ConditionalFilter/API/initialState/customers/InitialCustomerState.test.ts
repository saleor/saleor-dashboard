import { UrlEntry, UrlToken } from "../../../ValueProvider/UrlToken";
import { InitialCustomerStateResponse } from "./InitialCustomerState";

describe("ConditionalFilter / API / Customers / InitialCustomerState", () => {
  it("should filter by customer type slug", () => {
    // Arrange
    const initialCustomerState = InitialCustomerStateResponse.empty();

    initialCustomerState.customerType = [
      {
        label: "B2B",
        value: "Q3VzdG9tZXJUeXBlOjE=",
        slug: "b2b",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.customerType", "b2b"));
    const expectedOutput = [
      {
        label: "B2B",
        value: "Q3VzdG9tZXJUeXBlOjE=",
        slug: "b2b",
      },
    ];

    // Act
    const result = initialCustomerState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should return raw token value for date joined", () => {
    // Arrange
    const initialCustomerState = InitialCustomerStateResponse.empty();
    const token = UrlToken.fromUrlEntry(
      new UrlEntry("s3.dateJoined", ["2025-02-01", "2025-02-08"]),
    );

    // Act
    const result = initialCustomerState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(["2025-02-01", "2025-02-08"]);
  });

  it("should return raw token value for metadata", () => {
    // Arrange
    const initialCustomerState = InitialCustomerStateResponse.empty();
    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.metadata", ["key", "value"]));

    // Act
    const result = initialCustomerState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(["key", "value"]);
  });
});
