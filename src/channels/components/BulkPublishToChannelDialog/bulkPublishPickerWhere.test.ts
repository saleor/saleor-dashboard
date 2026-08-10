import { withBulkPublishCategoryWhere } from "./bulkPublishPickerWhere";

describe("withBulkPublishCategoryWhere", () => {
  it("returns hasCategory when no other where is set", () => {
    // Arrange & Act & Assert
    expect(withBulkPublishCategoryWhere(undefined)).toEqual({ hasCategory: true });
    expect(withBulkPublishCategoryWhere(null)).toEqual({ hasCategory: true });
    expect(withBulkPublishCategoryWhere({})).toEqual({ hasCategory: true });
  });

  it("ANDs hasCategory with modal filter where input", () => {
    // Arrange
    const where = { productType: { eq: "pt1" } };

    // Act & Assert
    expect(withBulkPublishCategoryWhere(where)).toEqual({
      AND: [{ hasCategory: true }, where],
    });
  });
});
