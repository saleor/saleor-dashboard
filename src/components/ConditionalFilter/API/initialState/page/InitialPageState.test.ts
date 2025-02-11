import { UrlEntry, UrlToken } from "../../../ValueProvider/UrlToken";
import { InitialPageStateResponse } from "./InitialPageState";

describe("ConditionalFilter / API / Page / InitialPageState", () => {
  it("should filter by page type", () => {
    // Arrange
    const initialPageState = InitialPageStateResponse.empty();

    initialPageState.pageTypes = [
      {
        label: "Home",
        value: "home",
        slug: "home",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.pageTypes", "home"));
    const expectedOutput = [
      {
        label: "Home",
        value: "home",
        slug: "home",
      },
    ];

    // Act
    const result = initialPageState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
