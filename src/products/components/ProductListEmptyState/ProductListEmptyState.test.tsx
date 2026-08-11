import { Wrapper } from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { messages } from "./messages";
import { ProductListEmptyState } from "./ProductListEmptyState";

describe("ProductListEmptyState", () => {
  it("shows create CTA for an empty catalog", async () => {
    // Arrange
    const onAdd = jest.fn();
    const user = userEvent.setup();

    // Act
    render(<ProductListEmptyState onAdd={onAdd} />, { wrapper: Wrapper });
    await user.click(screen.getByTestId("product-list-empty-create"));

    // Assert
    expect(screen.getByText(messages.emptyCatalogTitle.defaultMessage)).toBeInTheDocument();
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it("hides create CTA when search or filters explain the empty list", () => {
    // Arrange & Act
    render(<ProductListEmptyState hasSearchOrFilters onAdd={jest.fn()} />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(screen.getByText(messages.emptyFilteredTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.queryByTestId("product-list-empty-create")).not.toBeInTheDocument();
  });
});
