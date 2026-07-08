import { type AttributeFilterInput } from "@dashboard/graphql";

import { applyAttributeListFilters } from "./applyAttributeListFilters";

describe("applyAttributeListFilters", () => {
  const attributes = [
    {
      visibleInStorefront: true,
      filterableInStorefront: true,
      filterableInDashboard: true,
      valueRequired: false,
    },
    {
      visibleInStorefront: false,
      filterableInStorefront: false,
      filterableInDashboard: false,
      valueRequired: true,
    },
  ];

  it("should filter by visibleInStorefront", () => {
    // Arrange
    const filters: AttributeFilterInput = { visibleInStorefront: false };

    // Act
    const result = applyAttributeListFilters(attributes, filters);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].visibleInStorefront).toBe(false);
  });

  it("should filter by valueRequired when present on attributes", () => {
    // Arrange
    const filters: AttributeFilterInput = { valueRequired: true };

    // Act
    const result = applyAttributeListFilters(attributes, filters);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].valueRequired).toBe(true);
  });
});
