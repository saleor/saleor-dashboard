import { UrlEntry, UrlToken } from "../../../ValueProvider/UrlToken";
import { InitialProductTypesStateResponse } from "./InitialProductTypesState";

describe("ConditionalFilter / API / Page / InitialProductTypesState", () => {
  it("should filter by product type", () => {
    // Arrange
    const initialPageState = InitialProductTypesStateResponse.empty();

    initialPageState.typeOfProduct = [
      {
        label: "Type 1",
        value: "type-1",
        slug: "type-1",
      },
      {
        label: "Type 2",
        value: "type-2",
        slug: "type-2",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.typeOfProduct", "type-2"));
    const expectedOutput = [
      {
        label: "Type 2",
        value: "type-2",
        slug: "type-2",
      },
    ];

    // Act
    const result = initialPageState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should filter by configurable", () => {
    // Arrange
    const initialPageState = InitialProductTypesStateResponse.empty();

    initialPageState.configurable = [
      {
        label: "Yes",
        value: "CONFIGURABLE",
        slug: "yes",
      },
      {
        label: "No",
        value: "SIMPLE",
        slug: "no",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.configurable", "no"));
    const expectedOutput = [
      {
        label: "No",
        value: "SIMPLE",
        slug: "no",
      },
    ];

    // Act
    const result = initialPageState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
