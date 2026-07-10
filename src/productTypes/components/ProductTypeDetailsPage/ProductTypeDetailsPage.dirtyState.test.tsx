import ExitFormDialogProvider from "@dashboard/components/Form/ExitFormDialogProvider";
import { type ProductTypeDetailsQuery, WeightUnitsEnum } from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { productType } from "@dashboard/productTypes/fixtures";
import { productTypeListPath } from "@dashboard/productTypes/urls";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory, type MemoryHistory } from "history";
import type { ReactNode } from "react";
import { useState } from "react";
import { Route, Router } from "react-router-dom";

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
  default: ({
    setSelectedVariantAttributes,
    selectedVariantAttributes,
  }: {
    setSelectedVariantAttributes: (ids: string[]) => void;
    selectedVariantAttributes: string[];
  }) => (
    <button
      type="button"
      data-test-id="toggle-variant-selection"
      onClick={() =>
        setSelectedVariantAttributes(
          selectedVariantAttributes.length > 0 ? [] : ["UHJvZHVjdEF0dHJpYnV0ATo5"],
        )
      }
    />
  ),
}));

const listPath = productTypeListPath;

type ProductType = NonNullable<ProductTypeDetailsQuery["productType"]>;

const productTypeFixture: ProductType = productType!;
const detailPath = `/product-types/${productTypeFixture.id}`;
const productTypeWithVariants: ProductType = {
  ...productTypeFixture,
  hasVariants: true,
};

const defaultProps = {
  defaultWeightUnit: WeightUnitsEnum.KG,
  disabled: false,
  errors: [],
  saveButtonBarState: "default" as const,
  taxClasses: [],
  selectedVariantAttributes: ["UHJvZHVjdEF0dHJpYnV0ATo5"],
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

const StatefulProductTypePage = ({
  productTypeProp = productTypeWithVariants,
}: {
  productTypeProp?: ProductType;
}) => {
  const [selectedVariantAttributes, setSelectedVariantAttributes] = useState([
    "UHJvZHVjdEF0dHJpYnV0ATo5",
  ]);

  return (
    <ProductTypeDetailsPage
      {...defaultProps}
      productType={productTypeProp}
      selectedVariantAttributes={selectedVariantAttributes}
      setSelectedVariantAttributes={setSelectedVariantAttributes}
    />
  );
};

const renderPage = (
  history: MemoryHistory,
  page: ReactNode = <StatefulProductTypePage />,
): void => {
  render(
    <Router history={history}>
      <ExitFormDialogProvider>
        <ThemeProvider>
          <Route path="/product-types/:id">{page}</Route>
          <Route path={listPath}>
            <div data-test-id="product-type-list-page" />
          </Route>
        </ThemeProvider>
      </ExitFormDialogProvider>
    </Router>,
  );
};

describe("ProductTypeDetailsPage dirty state", () => {
  it("blocks navigation when the name field is edited", async () => {
    // Arrange
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: [detailPath] });

    renderPage(
      history,
      <ProductTypeDetailsPage {...defaultProps} productType={productTypeFixture} />,
    );

    // Act
    const nameInput = screen.getByLabelText("Product Type Name");

    await user.clear(nameInput);
    await user.type(nameInput, "Updated product type");
    await user.click(screen.getByTestId("app-header-back-button"));

    // Assert
    expect(screen.getByTestId("ignore-changes")).toBeInTheDocument();
    expect(history.location.pathname).toBe(detailPath);
  });

  it("blocks navigation when variant selection changes", async () => {
    // Arrange
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: [detailPath] });

    renderPage(history);

    // Act
    await user.click(screen.getByTestId("toggle-variant-selection"));
    await user.click(screen.getByTestId("app-header-back-button"));

    // Assert
    expect(screen.getByTestId("ignore-changes")).toBeInTheDocument();
    expect(history.location.pathname).toBe(detailPath);
  });

  it("allows navigation when the form is pristine", async () => {
    // Arrange
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: [detailPath] });

    renderPage(
      history,
      <ProductTypeDetailsPage {...defaultProps} productType={productTypeFixture} />,
    );

    // Act
    await user.click(screen.getByTestId("app-header-back-button"));

    // Assert
    expect(screen.queryByTestId("ignore-changes")).not.toBeInTheDocument();
    expect(history.location.pathname).toBe(listPath);
  });
});
