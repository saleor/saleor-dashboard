import { UrlEntry, UrlToken } from "../../../ValueProvider/UrlToken";
import { InitialCategoryStateResponse } from "./InitialCategoryState";

describe("ConditionalFilter / API / Category / InitialCategoryStateResponse", () => {
  it("should preserve metadata tuple from URL token", () => {
    // Arrange
    const initialCategoryState = InitialCategoryStateResponse.empty();
    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.metadata", ["foo", "bar"]));

    // Act
    const result = initialCategoryState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(["foo", "bar"]);
  });

  it("should preserve updatedAt value from URL token", () => {
    // Arrange
    const initialCategoryState = InitialCategoryStateResponse.empty();
    const token = UrlToken.fromUrlEntry(new UrlEntry("s4.updatedAt", "2026-02-13T20:08"));

    // Act
    const result = initialCategoryState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual("2026-02-13T20:08");
  });
});
