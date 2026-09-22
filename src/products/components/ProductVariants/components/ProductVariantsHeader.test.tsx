import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { ProductVariantsHeader } from "./ProductVariantsHeader";

const headerProps = {
  addRowOnDatagrid: jest.fn(),
  isAnimationOpenFinished: false,
  isFullscreenOpen: false,
  toggleFullscreen: jest.fn(),
  productId: "prod-1",
  productTypeId: "type-1",
  productName: "Bean Juice",
  hasVariants: true,
  hasVariantAttributes: true,
  unsupportedRequiredAttributes: [],
  onGenerateVariants: jest.fn(),
  onVariantsSearchChange: jest.fn(),
  variantsTotalCount: 1,
};

describe("ProductVariantsHeader pagination", () => {
  it("hides pagination when there is only one page", () => {
    // Arrange & Act
    render(
      <Wrapper>
        <MemoryRouter>
          <ProductVariantsHeader
            {...headerProps}
            variantsPageInfo={{ hasNextPage: false, hasPreviousPage: false }}
            variantsRangeLabel="1–1 of 1"
          />
        </MemoryRouter>
      </Wrapper>,
    );

    // Assert
    expect(screen.queryByTestId("variants-range-label")).not.toBeInTheDocument();
    expect(screen.queryByTestId("variants-pagination")).not.toBeInTheDocument();
  });

  it("shows pagination when there is another page", () => {
    // Arrange & Act
    render(
      <Wrapper>
        <MemoryRouter>
          <ProductVariantsHeader
            {...headerProps}
            variantsPageInfo={{ hasNextPage: true, hasPreviousPage: false }}
            variantsRangeLabel="1–20 of 40"
          />
        </MemoryRouter>
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("variants-range-label")).toHaveTextContent("1–20 of 40");
    expect(screen.getByTestId("variants-pagination")).toBeInTheDocument();
  });
});
