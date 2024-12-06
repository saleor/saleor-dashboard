import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";

import { ProductErrorCell } from "./ProductErrorCell";

describe("ProductErrorCell", () => {
  it("doesn't render when product has variant", () => {
    render(
      <Wrapper>
        <ProductErrorCell hasVariant />
      </Wrapper>,
    );

    const errorMessage = screen.queryByTestId("product-error-message");

    expect(errorMessage).not.toBeInTheDocument();
  });
  it("shows popup on hover", () => {
    render(
      <Wrapper>
        <ProductErrorCell hasVariant={false} />
      </Wrapper>,
    );

    const errorMessage = screen.getByTestId("product-error-message");

    expect(errorMessage).toBeInTheDocument();
    fireEvent.mouseOver(errorMessage);
    expect(screen.getByTestId("product-error-popup")).toBeInTheDocument();
  });
});
