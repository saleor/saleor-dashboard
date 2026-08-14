import { act, renderHook } from "@testing-library/react";

import { useProductTypeVariantSelection } from "./useProductTypeVariantSelection";

const typeId = "product-type-1";
const otherTypeId = "product-type-2";

const assignedWithSelection = [
  {
    variantSelection: true,
    attribute: { id: "attr-1" },
  },
  {
    variantSelection: false,
    attribute: { id: "attr-2" },
  },
];

describe("useProductTypeVariantSelection", () => {
  it("follows the server selection until the merchant edits", () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ assigned }) => useProductTypeVariantSelection(typeId, assigned),
      { initialProps: { assigned: [] as typeof assignedWithSelection } },
    );

    // Assert — incomplete cache / first paint must not look like an edit
    expect(result.current.selectedVariantAttributes).toEqual([]);

    // Act — details query fills assigned variant attributes
    rerender({ assigned: assignedWithSelection });

    // Assert
    expect(result.current.selectedVariantAttributes).toEqual(["attr-1"]);
  });

  it("keeps checkbox edits when the assigned list identity changes", () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ assigned }) => useProductTypeVariantSelection(typeId, assigned),
      { initialProps: { assigned: assignedWithSelection } },
    );

    // Act
    act(() => {
      result.current.setSelectedVariantAttributes([]);
    });
    rerender({
      assigned: [
        ...assignedWithSelection,
        {
          variantSelection: false,
          attribute: { id: "attr-3" },
        },
      ],
    });

    // Assert
    expect(result.current.selectedVariantAttributes).toEqual([]);
  });

  it("drops unassigned attributes from a staged selection draft", () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ assigned }) => useProductTypeVariantSelection(typeId, assigned),
      { initialProps: { assigned: assignedWithSelection } },
    );

    act(() => {
      result.current.setSelectedVariantAttributes(["attr-1", "attr-2"]);
    });

    // Act — live unassign removes attr-2
    rerender({
      assigned: [assignedWithSelection[0]],
    });

    // Assert
    expect(result.current.selectedVariantAttributes).toEqual(["attr-1"]);
  });

  it("drops the draft when opening a different product type", () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ id, assigned }) => useProductTypeVariantSelection(id, assigned),
      {
        initialProps: {
          id: typeId,
          assigned: assignedWithSelection,
        },
      },
    );

    act(() => {
      result.current.setSelectedVariantAttributes([]);
    });

    // Act
    rerender({
      id: otherTypeId,
      assigned: [
        {
          variantSelection: true,
          attribute: { id: "attr-9" },
        },
      ],
    });

    // Assert
    expect(result.current.selectedVariantAttributes).toEqual(["attr-9"]);
  });
});
