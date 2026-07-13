import { pageListPath, pageListUrlWithPageType, pageListUrlWithPageTypes } from "./urls";

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

describe("pageListUrlWithPageTypes", () => {
  it("returns null when no model type ids are provided", () => {
    // Arrange & Act
    const result = pageListUrlWithPageTypes([]);

    // Assert
    expect(result).toBeNull();
  });

  it("builds URL filtered by a single model type id", () => {
    // Arrange
    const pageTypeId = "UGFnZVR5cGU6MQ==";

    // Act
    const result = pageListUrlWithPageTypes([pageTypeId]);

    // Assert
    expect(result).toContain("/models/");
    expect(result).toContain("pageTypes");
    expect(decodeURIComponent(result!)).toContain(pageTypeId);
  });

  it("builds URL filtered by multiple model type ids", () => {
    // Arrange
    const pageTypeIds = ["UGFnZVR5cGU6MQ==", "UGFnZVR5cGU6Mg=="];

    // Act
    const result = pageListUrlWithPageTypes(pageTypeIds);

    // Assert
    expect(result).toContain("/models/");
    expect(decodeURIComponent(result!)).toContain(pageTypeIds[0]);
    expect(decodeURIComponent(result!)).toContain(pageTypeIds[1]);
  });
});
