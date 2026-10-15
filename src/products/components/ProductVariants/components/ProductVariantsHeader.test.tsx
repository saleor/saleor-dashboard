import { productVariantAddUrl } from "@dashboard/products/urls";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";
import { type ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";

import { ProductVariantsHeader } from "./ProductVariantsHeader";

const mockNavigate = jest.fn();

jest.mock("@dashboard/hooks/useNavigator", () => () => mockNavigate);

const headerProps: ComponentProps<typeof ProductVariantsHeader> = {
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

describe("ProductVariantsHeader actions", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("opens the variant create page from Add variant outside bulk edit", () => {
    // Arrange
    render(
      <Wrapper>
        <MemoryRouter>
          <ProductVariantsHeader {...headerProps} isFullscreenOpen={false} />
        </MemoryRouter>
      </Wrapper>,
    );

    // Act
    fireEvent.click(screen.getByTestId("button-add-variant"));

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(productVariantAddUrl("prod-1"));
  });

  it("hides Add variant in bulk edit, where the trailing empty row adds variants", () => {
    // Act
    render(
      <Wrapper>
        <MemoryRouter>
          <ProductVariantsHeader {...headerProps} isFullscreenOpen />
        </MemoryRouter>
      </Wrapper>,
    );

    // Assert
    expect(screen.queryByTestId("button-add-variant")).not.toBeInTheDocument();
    expect(screen.getByTestId("button-exit-fullscreen")).toBeInTheDocument();
  });
});
