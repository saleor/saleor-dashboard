import { pageListPath, pageListUrlWithPageType } from "./urls";

describe("pageListUrlWithPageType", () => {
  it("returns pageListPath when model type is undefined", () => {
    // Arrange & Act
    const result = pageListUrlWithPageType(undefined);

    // Assert
    expect(result).toBe(pageListPath);
  });

  it("returns pageListPath when model type id is missing", () => {
    // Arrange & Act
    const result = pageListUrlWithPageType({ id: "" });

    // Assert
    expect(result).toBe(pageListPath);
  });

  it("builds URL filtered by model type id", () => {
    // Arrange
    const pageType = { id: "UGFnZVR5cGU6MQ==" };

    // Act
    const result = pageListUrlWithPageType(pageType);

    // Assert
    expect(result).toContain("/models/");
    expect(result).toContain("pageTypes");
    expect(decodeURIComponent(result)).toContain(pageType.id);
  });
});
