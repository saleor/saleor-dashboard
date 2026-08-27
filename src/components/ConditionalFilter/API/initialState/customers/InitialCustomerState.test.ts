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

  it("should resolve attribute choices from the attribute map", () => {
    // Arrange
    const initialCustomerState = new InitialCustomerStateResponse([], {
      industry: {
        choices: [
          { label: "Retail", value: "choice-id", slug: "choice-id", originalSlug: "retail" },
        ],
        inputType: "DROPDOWN",
        label: "Industry",
        slug: "industry",
        value: "attr-id",
      },
    });
    const token = UrlToken.fromUrlEntry(new UrlEntry("o2.industry", "choice-id"));

    // Act
    const result = initialCustomerState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual([
      { label: "Retail", value: "choice-id", slug: "choice-id", originalSlug: "retail" },
    ]);
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
