import { AttributeListUrlSortField } from "@dashboard/attributes/urls";
import { filterAssignedAttributes } from "@dashboard/attributes/utils/filterAssignedAttributes";
import { type AttributeFragment, AttributeTypeEnum } from "@dashboard/graphql";

const createAttribute = (overrides: Partial<AttributeFragment> = {}): AttributeFragment => ({
  __typename: "Attribute",
  id: "attr-1",
  name: "Color",
  slug: "color",
  type: AttributeTypeEnum.PAGE_TYPE,
  visibleInStorefront: true,
  filterableInStorefront: false,
  filterableInDashboard: true,
  unit: null,
  inputType: null,
  ...overrides,
});

describe("filterAssignedAttributes", () => {
  it("should filter attributes by search query", () => {
    // Arrange
    const attributes = [
      createAttribute({ id: "1", name: "Color", slug: "color" }),
      createAttribute({ id: "2", name: "Size", slug: "size" }),
    ];

    // Act
    const result = filterAssignedAttributes(attributes, "size", {
      sort: AttributeListUrlSortField.name,
      asc: true,
    });

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("size");
  });

  it("should sort attributes by slug descending", () => {
    // Arrange
    const attributes = [
      createAttribute({ id: "1", name: "A", slug: "a-slug" }),
      createAttribute({ id: "2", name: "B", slug: "z-slug" }),
    ];

    // Act
    const result = filterAssignedAttributes(attributes, undefined, {
      sort: AttributeListUrlSortField.slug,
      asc: false,
    });

    // Assert
    expect(result.map(attribute => attribute.slug)).toEqual(["z-slug", "a-slug"]);
  });
});
