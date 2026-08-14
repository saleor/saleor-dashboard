import { ProductAttributeType } from "@dashboard/graphql";
import { productType } from "@dashboard/productTypes/fixtures";
import Wrapper from "@test/wrapper";
import { render, screen, within } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import ProductTypeAttributes from "./ProductTypeAttributes";

const listProps = {
  disabled: false,
  type: ProductAttributeType.PRODUCT,
  isChecked: () => false,
  selected: 0,
  toggle: () => undefined,
  toggleAll: () => undefined,
  toolbar: null,
  onAttributeAssign: () => undefined,
  onAttributeCreate: () => undefined,
  onAttributeReorder: () => undefined,
  onAttributeUnassign: () => undefined,
};

describe("ProductTypeAttributes loading", () => {
  it("keeps table headings while attribute rows are loading", () => {
    // Arrange & Act
    render(<ProductTypeAttributes {...listProps} attributes={undefined} disabled />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(screen.getByText("Attribute name")).toBeInTheDocument();
    expect(screen.getByText("Value required")).toBeInTheDocument();
    expect(screen.queryByText("Slug")).not.toBeInTheDocument();
    expect(screen.getByTestId("product-attributes-skeleton")).toBeInTheDocument();
  });
});

describe("ProductTypeAttributes value required column", () => {
  it("shows Required and Optional from the assigned attributes", () => {
    // Arrange & Act
    const history = createMemoryHistory({ initialEntries: ["/product-types/1"] });

    render(
      <Router history={history}>
        <ProductTypeAttributes attributes={productType?.productAttributes} {...listProps} />
      </Router>,
      { wrapper: Wrapper },
    );

    // Assert
    const authorRow = screen.getByText("Author").closest("tr");
    const languageRow = screen.getByText("Language").closest("tr");

    if (!authorRow || !languageRow) {
      throw new Error("Expected Author and Language rows");
    }

    expect(within(authorRow).getByTestId("value-required")).toHaveTextContent("Required");
    expect(within(languageRow).getByTestId("value-required")).toHaveTextContent("Optional");
  });
});
