import { AttributeInputTypeEnum } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react-hooks";

import { STATIC_PRODUCT_OPTIONS } from "./constants";
import { useFilterLeftOperandsProvider } from "./useFilterLeftOperands";

describe("ConditionalFilter / useFilterLeftOperandsProvider", () => {
  it("should set unique operands", () => {
    // Arrange
    const { result } = renderHook(() =>
      useFilterLeftOperandsProvider(STATIC_PRODUCT_OPTIONS),
    );
    // Act
    act(() => {
      result.current.setOperands([
        {
          label: "SKU",
          value: "sku",
          type: AttributeInputTypeEnum.DROPDOWN,
          slug: "sku",
        },
      ]);
    });
    // Assert
    expect(result.current.operands).toEqual([
      ...STATIC_PRODUCT_OPTIONS,
      { label: "SKU", value: "sku", type: "DROPDOWN", slug: "sku" },
    ]);
    // Act
    act(() => {
      result.current.setOperands([
        {
          label: "SKU",
          value: "sku",
          type: AttributeInputTypeEnum.DROPDOWN,
          slug: "sku",
        },
      ]);
    });
    // Assert
    expect(result.current.operands).toEqual([
      ...STATIC_PRODUCT_OPTIONS,
      { label: "SKU", value: "sku", type: "DROPDOWN", slug: "sku" },
    ]);
  });
});
