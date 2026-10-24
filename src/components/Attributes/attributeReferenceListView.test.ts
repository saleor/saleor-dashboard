import {
  ATTRIBUTE_REFERENCE_LIST_VIEW_STORAGE_KEY,
  attributeReferenceListMode,
  withAttributeReferenceListMode,
} from "./attributeReferenceListView";

describe("attribute reference list view", () => {
  it("stays on the list until this type has chosen packed", () => {
    // Arrange
    const modes = withAttributeReferenceListMode({
      modes: {},
      view: "product",
      typeId: "shoes",
      mode: "packed",
    });

    // Assert
    expect(ATTRIBUTE_REFERENCE_LIST_VIEW_STORAGE_KEY).toBe("attributeReferenceListView");
    expect(attributeReferenceListMode({ modes, view: "product", typeId: "shoes" })).toBe("packed");
    expect(attributeReferenceListMode({ modes, view: "product", typeId: "bags" })).toBe("list");
    expect(attributeReferenceListMode({ modes, view: "variant", typeId: "shoes" })).toBe("list");
    expect(attributeReferenceListMode({ modes: {}, view: "product", typeId: "shoes" })).toBe(
      "list",
    );
  });
});
