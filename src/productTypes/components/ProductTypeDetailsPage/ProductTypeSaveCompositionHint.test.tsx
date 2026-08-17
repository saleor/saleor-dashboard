import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { ProductTypeSaveCompositionHint } from "./ProductTypeSaveCompositionHint";
import { type ProductTypeSaveComposition } from "./saveComposition";

const renderHint = (composition?: ProductTypeSaveComposition | null) =>
  render(
    <Wrapper>
      <ProductTypeSaveCompositionHint composition={composition} />
    </Wrapper>,
  );

describe("ProductTypeSaveCompositionHint", () => {
  it("renders nothing when composition is empty", () => {
    // Arrange / Act
    renderHint({
      hasGeneral: false,
      hasShipping: false,
      hasTaxes: false,
      hasVariantSelection: false,
    });

    // Assert
    expect(screen.queryByTestId("product-type-save-composition")).not.toBeInTheDocument();
  });

  it("lists dirty product type sections", () => {
    // Arrange / Act
    renderHint({
      hasGeneral: true,
      hasShipping: true,
      hasTaxes: true,
      hasVariantSelection: true,
    });

    // Assert
    const hint = screen.getByTestId("product-type-save-composition");

    expect(hint).toHaveTextContent("Unsaved changes:");
    expect(hint).toHaveTextContent("general");
    expect(hint).toHaveTextContent("shipping");
    expect(hint).toHaveTextContent("taxes");
    expect(hint).toHaveTextContent("variant selection");
  });
});
