import { productType } from "@dashboard/productTypes/fixtures";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import ProductTypeDetailsPage from "./ProductTypeDetailsPage";

jest.mock("@dashboard/components/Savebar");
jest.mock("../ProductTypeAttributes/ProductTypeAttributes", () => ({
  __esModule: true,
  default: () => <div data-test-id="product-type-attributes-mock" />,
}));
jest.mock("../ProductTypeDetails/ProductTypeDetails", () => ({
  __esModule: true,
  default: () => <div data-test-id="product-type-details-mock" />,
}));
jest.mock("../ProductTypeShipping/ProductTypeShipping", () => ({
  __esModule: true,
  default: () => <div data-test-id="product-type-shipping-mock" />,
}));
jest.mock("../ProductTypeTaxes/ProductTypeTaxes", () => ({
  ProductTypeTaxes: () => <div data-test-id="product-type-taxes-mock" />,
}));
jest.mock("../ProductTypeVariantAttributes/ProductTypeVariantAttributes", () => ({
  __esModule: true,
  default: () => <div data-test-id="product-type-variant-attributes-mock" />,
}));

const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <MemoryRouter>
    <ThemeProvider>{children}</ThemeProvider>
  </MemoryRouter>
);

const defaultProps = {
  defaultWeightUnit: "KG" as const,
  disabled: false,
  errors: [],
  saveButtonBarState: "default" as const,
  taxClasses: [],
  selectedVariantAttributes: [],
  setSelectedVariantAttributes: jest.fn(),
  onFetchMoreTaxClasses: {
    hasMore: false,
    loading: false,
    onFetchMore: jest.fn(),
  },
  productAttributeList: {
    isChecked: () => false,
    selected: 0,
    toggle: jest.fn(),
    toggleAll: jest.fn(),
    toolbar: null,
  },
  variantAttributeList: {
    isChecked: () => false,
    selected: 0,
    toggle: jest.fn(),
    toggleAll: jest.fn(),
    toolbar: null,
  },
  onAttributeAdd: jest.fn(),
  onAttributeCreate: jest.fn(),
  onAttributeReorder: jest.fn(),
  onAttributeUnassign: jest.fn(),
  onDelete: jest.fn(),
  onShowMetadata: jest.fn(),
  onHasVariantsToggle: jest.fn(),
  onSubmit: jest.fn(),
};

const renderPage = ({
  productTypeProp,
  onShowMetadata = jest.fn(),
}: {
  productTypeProp: typeof productType | undefined;
  onShowMetadata?: () => void;
}): ReturnType<typeof render> =>
  render(
    <ProductTypeDetailsPage
      {...defaultProps}
      productType={productTypeProp}
      onShowMetadata={onShowMetadata}
    />,
    { wrapper: Wrapper },
  );

describe("ProductTypeDetailsPage top nav", () => {
  it("renders the metadata button", () => {
    // Arrange & Act
    renderPage({ productTypeProp: productType });

    // Assert
    expect(screen.getByTestId("show-product-type-metadata")).toBeInTheDocument();
  });

  it("calls onShowMetadata when the metadata button is clicked", () => {
    // Arrange
    const onShowMetadata = jest.fn();

    renderPage({ productTypeProp: productType, onShowMetadata });

    // Act
    screen.getByTestId("show-product-type-metadata").click();

    // Assert
    expect(onShowMetadata).toHaveBeenCalled();
  });

  it("disables the metadata button while product type data is loading", () => {
    // Arrange & Act
    renderPage({ productTypeProp: undefined });

    // Assert
    expect(screen.getByTestId("show-product-type-metadata")).toBeDisabled();
  });
});
