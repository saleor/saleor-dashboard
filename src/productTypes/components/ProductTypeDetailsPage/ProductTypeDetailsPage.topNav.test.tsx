import { type ProductTypeDetailsQuery, WeightUnitsEnum } from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { productType } from "@dashboard/productTypes/fixtures";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import ProductTypeDetailsPage from "./ProductTypeDetailsPage";

jest.mock("@dashboard/components/Savebar");
jest.mock("@dashboard/components/DevModePanel/hooks", () => ({
  useDevModeContext: () => ({
    setDevModeContent: jest.fn(),
    setVariables: jest.fn(),
    setDevModeVisibility: jest.fn(),
  }),
}));
jest.mock("../ProductTypeAttributes/ProductTypeAttributes", () => ({
  __esModule: true,
  default: () => <div data-test-id="product-type-attributes-mock" />,
}));
jest.mock("../ProductTypeDetails/ProductTypeDetails", () => ({
  __esModule: true,
  default: () => <div data-test-id="product-type-details-mock" />,
}));
jest.mock("../ProductTypeConfiguration/ProductTypeConfiguration", () => ({
  ProductTypeConfiguration: () => <div data-test-id="product-type-configuration-mock" />,
}));
jest.mock("../ProductTypeShipping/ProductTypeShipping", () => ({
  __esModule: true,
  default: () => <div data-test-id="product-type-shipping-mock" />,
}));
jest.mock("../ProductTypeTaxes/ProductTypeTaxes", () => ({
  ProductTypeTaxes: () => <div data-test-id="product-type-taxes-mock" />,
}));
jest.mock("../ProductTypeVariantMode/ProductTypeVariantMode", () => ({
  ProductTypeVariantMode: () => <div data-test-id="product-type-variant-mode-mock" />,
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

const productTypeFixture: NonNullable<ProductTypeDetailsQuery["productType"]> = productType!;

const defaultProps = {
  defaultWeightUnit: WeightUnitsEnum.KG,
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
  onSubmit: jest.fn((): SubmitPromise => Promise.resolve([])),
};

const renderPage = ({
  productTypeProp,
  onShowMetadata = jest.fn(),
  onDelete = jest.fn(),
}: {
  productTypeProp: NonNullable<ProductTypeDetailsQuery["productType"]> | null | undefined;
  onShowMetadata?: () => void;
  onDelete?: () => void;
}): ReturnType<typeof render> =>
  render(
    <ProductTypeDetailsPage
      {...defaultProps}
      productType={productTypeProp ?? null}
      onShowMetadata={onShowMetadata}
      onDelete={onDelete}
    />,
    { wrapper: Wrapper },
  );

describe("ProductTypeDetailsPage top nav", () => {
  it("renders the metadata button", () => {
    // Arrange & Act
    renderPage({ productTypeProp: productTypeFixture });

    // Assert
    expect(screen.getByTestId("show-product-type-metadata")).toBeInTheDocument();
  });

  it("calls onShowMetadata when the metadata button is clicked", () => {
    // Arrange
    const onShowMetadata = jest.fn();

    renderPage({ productTypeProp: productTypeFixture, onShowMetadata });

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

  it("calls onDelete from the cogs menu", async () => {
    // Arrange
    const user = userEvent.setup();
    const onDelete = jest.fn();

    renderPage({ productTypeProp: productTypeFixture, onDelete });

    // Act
    await user.click(screen.getByTestId("show-more-button"));
    await user.click(screen.getByTestId("delete-product-type"));

    // Assert
    expect(onDelete).toHaveBeenCalled();
  });
});
