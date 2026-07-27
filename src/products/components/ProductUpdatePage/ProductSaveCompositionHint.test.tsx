import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { ProductSaveCompositionHint } from "./ProductSaveCompositionHint";
import { type ProductSaveComposition } from "./saveComposition";

const renderHint = (composition?: ProductSaveComposition | null) =>
  render(
    <Wrapper>
      <ProductSaveCompositionHint composition={composition} />
    </Wrapper>,
  );

describe("ProductSaveCompositionHint", () => {
  it("renders nothing when composition is empty", () => {
    // Arrange / Act
    renderHint({
      hasDetails: false,
      dirtyChannelCount: 0,
      variantEditCount: 0,
      variantCreateCount: 0,
      variantDeleteCount: 0,
    });

    // Assert
    expect(screen.queryByTestId("product-save-composition")).not.toBeInTheDocument();
  });

  it("renders nothing when composition is omitted", () => {
    // Arrange / Act
    renderHint();

    // Assert
    expect(screen.queryByTestId("product-save-composition")).not.toBeInTheDocument();
  });

  it("lists details, channels, and distinct variants edited", () => {
    // Arrange / Act
    renderHint({
      hasDetails: true,
      dirtyChannelCount: 2,
      variantEditCount: 2,
      variantCreateCount: 1,
      variantDeleteCount: 3,
    });

    // Assert
    const hint = screen.getByTestId("product-save-composition");

    expect(hint).toHaveTextContent("Unsaved changes:");
    expect(hint).toHaveTextContent("details");
    expect(hint).toHaveTextContent("2 channels edited");
    expect(hint).toHaveTextContent("2 variants edited");
    expect(hint).toHaveTextContent("1 new variant");
    expect(hint).toHaveTextContent("3 variants pending delete");
  });

  it("uses singular copy for one variant edited", () => {
    // Arrange / Act
    renderHint({
      hasDetails: false,
      dirtyChannelCount: 0,
      variantEditCount: 1,
      variantCreateCount: 0,
      variantDeleteCount: 0,
    });

    // Assert
    expect(screen.getByTestId("product-save-composition")).toHaveTextContent("1 variant edited");
    expect(screen.getByTestId("product-save-composition")).not.toHaveTextContent("variant edit,");
  });
});
