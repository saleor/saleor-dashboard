import { ProductAttributeType } from "@dashboard/graphql";
import { productType } from "@dashboard/productTypes/fixtures";
import Wrapper from "@test/wrapper";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory, type MemoryHistory } from "history";
import { Router } from "react-router-dom";

import ProductTypeVariantAttributes from "./ProductTypeVariantAttributes";

const attributeId = "UHJvZHVjdEF0dHJpYnV0ATo5";
const listPath = "/product-types/1";

const renderVariantAttributes = ({
  selectedVariantAttributes = [attributeId],
  setSelectedVariantAttributes = jest.fn(),
  toggle = jest.fn(),
}: {
  selectedVariantAttributes?: string[];
  setSelectedVariantAttributes?: jest.Mock;
  toggle?: jest.Mock;
} = {}): {
  history: MemoryHistory;
  setSelectedVariantAttributes: jest.Mock;
  toggle: jest.Mock;
} => {
  const history = createMemoryHistory({ initialEntries: [listPath] });

  render(
    <Router history={history}>
      <ProductTypeVariantAttributes
        assignedVariantAttributes={productType?.assignedVariantAttributes}
        disabled={false}
        hasVariants={true}
        type={ProductAttributeType.VARIANT}
        selectedVariantAttributes={selectedVariantAttributes}
        setSelectedVariantAttributes={setSelectedVariantAttributes}
        isChecked={() => false}
        selected={0}
        toggle={toggle}
        toggleAll={jest.fn()}
        toolbar={null}
        onAttributeAssign={jest.fn()}
        onAttributeCreate={jest.fn()}
        onAttributeReorder={jest.fn()}
        onAttributeUnassign={jest.fn()}
        onHasVariantsToggle={jest.fn()}
      />
    </Router>,
    { wrapper: Wrapper },
  );

  return { history, setSelectedVariantAttributes, toggle };
};

describe("ProductTypeVariantAttributes row controls", () => {
  it("toggles variant selection without navigating to the attribute", async () => {
    // Arrange
    const user = userEvent.setup();
    const { history, setSelectedVariantAttributes } = renderVariantAttributes();
    const pill = screen.getByTestId("variant-selection-checkbox");
    let clickDefaultPrevented = false;

    pill.addEventListener("click", event => {
      clickDefaultPrevented = event.defaultPrevented;
    });

    // Act
    await user.click(pill);

    // Assert
    expect(setSelectedVariantAttributes).toHaveBeenCalledWith([]);
    expect(clickDefaultPrevented).toBe(true);
    expect(history.location.pathname).toBe(listPath);
  });

  it("toggles the row checkbox without navigating to the attribute", async () => {
    // Arrange
    const user = userEvent.setup();
    const { history, toggle } = renderVariantAttributes();
    const row = screen.getByText("Author").closest("tr");

    if (!row) {
      throw new Error("Expected a table row for the Author attribute");
    }

    const checkbox = within(row).getByRole("checkbox");

    // Act
    await user.click(checkbox);

    // Assert
    expect(toggle).toHaveBeenCalledWith(attributeId);
    expect(history.location.pathname).toBe(listPath);
  });

  it("shows whether the attribute value is required", () => {
    // Arrange & Act
    renderVariantAttributes();

    // Assert
    expect(screen.getByText("Value required")).toBeInTheDocument();
    expect(screen.getByTestId("value-required")).toHaveTextContent("Required");
  });
});
